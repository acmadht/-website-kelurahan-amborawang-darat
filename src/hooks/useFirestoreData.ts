"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where, type WhereFilterOp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { sortByOrder } from "@/lib/utils";

export function useCollectionData<T extends { id?: string; order?: number }>(
  collectionName: string,
  fallback: T[],
  filters: Array<{ field: string; op: WhereFilterOp; value: unknown }> = [],
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [usingDemo, setUsingDemo] = useState(!isFirebaseConfigured);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const base = collection(db, collectionName);
        const source = filters.length
          ? query(base, ...filters.map((filter) => where(filter.field, filter.op, filter.value)))
          : base;
        const snapshot = await getDocs(source);
        const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as T[];
        if (active) {
          setData(sortByOrder(items));
          setUsingDemo(false);
        }
      } catch (error) {
        console.error(`Gagal memuat ${collectionName}`, error);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [collectionName, JSON.stringify(filters)]);

  return { data, loading, usingDemo };
}

export function useDocumentData<T>(
  collectionName: string,
  documentId: string,
  fallback: T,
) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [usingDemo, setUsingDemo] = useState(!isFirebaseConfigured);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, collectionName, documentId));
        if (active && snapshot.exists()) {
          setData(snapshot.data() as T);
          setUsingDemo(false);
        }
      } catch (error) {
        console.error(`Gagal memuat ${collectionName}/${documentId}`, error);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [collectionName, documentId]);

  return { data, loading, usingDemo };
}
