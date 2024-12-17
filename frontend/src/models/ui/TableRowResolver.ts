import { ReactNode } from 'react';

export interface TableRowResolver<T> {
    label: () => ReactNode, 
    value: (i: T) => ReactNode
  }
