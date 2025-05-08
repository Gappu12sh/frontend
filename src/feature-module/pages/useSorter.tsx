import { useState } from 'react';

interface Sorter {
  column: string;
  direction: 'asc' | 'desc';
}

export const useSorter = <T extends Record<string, any>>(initialColumn: string, initialDirection: 'asc' | 'desc') => {
  const [sorter, setSorter] = useState<Sorter>({
    column: initialColumn,
    direction: initialDirection,
  });

  const sortData = (data: T[]): T[] => {
    const { column, direction } = sorter;

    return data.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * (direction === 'asc' ? 1 : -1);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * (direction === 'asc' ? 1 : -1);
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        return (valueA.getTime() - valueB.getTime()) * (direction === 'asc' ? 1 : -1);
      }

      return 0;
    });
  };

  const toggleSortDirection = (column: string) => {
    setSorter((prevSorter) => {
      if (prevSorter.column === column) {
        return {
          ...prevSorter,
          direction: prevSorter.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        column,
        direction: 'asc',
      };
    });
  };

  return {
    sorter,
    setSorter,
    sortData,
    toggleSortDirection,
  };
};
