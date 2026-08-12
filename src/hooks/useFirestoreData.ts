"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { sortByOrder } from "@/lib/utils";

type Filter = {
  field: string;
  op: WhereFilterOp;
  value: unknown;
};

export function useCollectionData<T extends { id?: string; order?: number }>(
  collectionName: string,
  fallback: T[],
  filters: Filter[] = [],
  enabled = true,
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(isFirebaseConfigured && fallback.length === 0);
  const [usingDemo, setUsingDemo] = useState(!isFirebaseConfigured);

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    if (!enabled) {
      setData(fallback);
      setLoading(false);
      setUsingDemo(false);
      return;
    }

    if (!db) {
      setData(fallback);
      setLoading(false);
      setUsingDemo(true);
      return;
    }

    setLoading(true);

    const constraints: QueryConstraint[] = filters.map((filter) =>
      where(filter.field, filter.op, filter.value),
    );

    const base = collection(db, collectionName);
    const source = constraints.length ? query(base, ...constraints) : base;

    const unsubscribe = onSnapshot(
      source,
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as T[];

        setData(sortByOrder(items));
        setUsingDemo(false);
        setLoading(false);
      },
      (error) => {
        console.error(`Gagal memantau ${collectionName}`, error);
        // Jangan tampilkan data demo saat Firebase sudah terhubung tetapi gagal
        // dibaca. Lebih aman menampilkan keadaan kosong daripada data palsu/stale.
        setData([]);
        setUsingDemo(false);
        setLoading(false);
      },
    );

    return unsubscribe;
    // filterKey dipakai agar listener dibuat ulang hanya jika isi filter berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, filterKey, enabled]);

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
    if (!db) {
      setData(fallback);
      setLoading(false);
      setUsingDemo(true);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (snapshot) => {
        if (snapshot.exists()) {
          const remote = snapshot.data();

          if (
            typeof fallback === "object" &&
            fallback !== null &&
            !Array.isArray(fallback)
          ) {
            setData({ ...(fallback as Record<string, unknown>), ...remote } as T);
          } else {
            setData(remote as T);
          }

          setUsingDemo(false);
        } else {
          setData(fallback);
          setUsingDemo(true);
        }

        setLoading(false);
      },
      (error) => {
        console.error(
          `Gagal memantau ${collectionName}/${documentId}`,
          error,
        );
        setData(fallback);
        setUsingDemo(true);
        setLoading(false);
      },
    );

    return unsubscribe;
  // fallback berfungsi sebagai nilai cadangan awal. Listener mengikuti identitas dokumen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, documentId]);

  return { data, loading, usingDemo };
}
