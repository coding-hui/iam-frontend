import type React from 'react';
import type { DataNode as DataNode_ } from 'antd/es/tree';

export type DataNode = {
  id: string;
  name: string;
  parentId: string;
  metadata: API.ObjectMeta;
  organizationId: string;
  children: DataNode[];
} & DataNode_;

export function convertToTreeData(list: any): DataNode[] {
  return !list
    ? []
    : list.map((item: { displayName: string; metadata: { instanceId: any; name: any } }) => {
        return {
          id: item.metadata.instanceId,
          name: item.displayName,
          ...item,
        };
      });
}

export function updateTreeData(
  list: DataNode[],
  key: React.Key,
  children: DataNode[] | any[] = [],
  disabledId?: string,
): DataNode[] {
  return list.map((node) => {
    const disabled = node.id === disabledId;
    const child = children.map((e) => {
      if (e.id === disabledId) {
        return {
          ...e,
          isLeaf: true,
          disabled: true,
        };
      }
      return e;
    });
    if (node.id === key) {
      return {
        ...node,
        disabled,
        isLeaf: false,
        children: disabled ? [] : child,
      };
    }
    if (node.children) {
      return {
        ...node,
        disabled,
        children: disabled ? [] : updateTreeData(node.children, key, children, disabledId),
      };
    }
    return node;
  });
}

export function getTreeAllKeys(list: DataNode[] | any): React.Key[] {
  const keys: React.Key[] = [];
  list.forEach((node: { id: React.Key; children: DataNode[] }): React.Key[] => {
    keys.push(node.id);
    if (node.children) {
      keys.push(...getTreeAllKeys(node.children));
    }
    return keys;
  });
  return keys;
}
