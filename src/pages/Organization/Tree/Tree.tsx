import type { DataNode } from '@/utils/tree';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import React, { useState } from 'react';
import { App, Card, Dropdown, Menu, Skeleton, Spin, Tooltip, Tree } from 'antd';
import classnames from 'classnames';
import {
  ApartmentOutlined,
  DeleteOutlined,
  DownCircleOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import useStyle from './style';
import { BASIC_INTL } from '@/constant';
import { useIntl } from '@@/exports';

import SearchTree from './SearchTree';
import useOrgTreeHook from './_hooks';
import { CreateDepartment } from '@/pages/Organization/components';
import MoveTree from '@/pages/Organization/Tree/MoveTree';

const prefixCls = 'organization-tree';

export type Props = {
  onSelect: (id: string, name: string) => void;
};

const INTL = {
  TREE_MENU_ITEM_EDIT: {
    id: 'organization.tree.menu.edit',
  },
  TREE_MENU_ITEM_ADD: {
    id: 'organization.tree.menu.add',
  },
  TREE_MENU_ITEM_MOVE: {
    id: 'organization.tree.menu.move',
  },
  TREE_MENU_ITEM_REMOVE: {
    id: 'organization.tree.menu.remove',
  },
};

const OrgTree: React.FC<Props> = (props) => {
  const { onSelect } = props;
  const intl = useIntl();
  const { styles } = useStyle(prefixCls);
  const { modal } = App.useApp();

  const {
    states: {
      initLoading,
      organizationData,
      loadedKeys,
      selectedKeys,
      expandedKeys,
      autoExpandParent,
      currentSelectedNode,
      addModalVisible,
      editModalVisible,
      moveModalVisible,
      searching,
      loadRootOrgDataLoading,
      loadChildLoading,
    },
    actions: {
      doDelete,
      loadChildren,
      setCurrentSelectedNode,
      setLoadedKeys,
      setExpandedKeys,
      setAutoExpandParent,
      setSelectedKeys,
      toggleAddModalVisible,
      toggleEditModalVisible,
      toggleMoveModalVisible,
      beginSearching,
      endSearching,
      getRootOrganizationData,
    },
  } = useOrgTreeHook(props);

  const HandleIcon = (showIcon: boolean) => {
    return showIcon ? <ApartmentOutlined style={{ marginRight: 5 }} /> : <></>;
  };

  const [dropdownId, setDropdownId] = useState<string>();

  const optionsRender = (node: DataNode & { parentId: string; id: string }) => {
    const addItem = {
      key: 'add',
      label: (
        <div className={styles}>
          <div className={classnames(`${prefixCls}-item-action`)}>
            <PlusOutlined />
            <span
              className={classnames(`${prefixCls}-item-action-text`)}
              onClick={() => {
                setCurrentSelectedNode(node);
                toggleAddModalVisible();
              }}
            >
              {intl.formatMessage(INTL.TREE_MENU_ITEM_ADD)}
            </span>
          </div>
        </div>
      ),
    };
    const updateItem = {
      key: 'update',
      label: (
        <div className={styles}>
          <div className={classnames(`${prefixCls}-item-action`)}>
            <EditOutlined />
            <span
              className={classnames(`${prefixCls}-item-action-text`)}
              onClick={() => {
                setCurrentSelectedNode(node);
                toggleEditModalVisible();
              }}
            >
              {intl.formatMessage(INTL.TREE_MENU_ITEM_EDIT)}
            </span>
          </div>
        </div>
      ),
    };
    const moveItem = {
      key: 'move',
      label: (
        <div className={styles}>
          <div className={classnames(`${prefixCls}-item-action`)}>
            <DownCircleOutlined />
            <span
              className={classnames(`${prefixCls}-item-action-text`)}
              onClick={() => {
                setCurrentSelectedNode(node);
                toggleMoveModalVisible();
              }}
            >
              {intl.formatMessage(INTL.TREE_MENU_ITEM_MOVE)}
            </span>
          </div>
        </div>
      ),
    };
    const removeItem = {
      key: 'remove',
      label: (
        <div className={styles}>
          <div className={classnames(`${prefixCls}-item-action`)}>
            <DeleteOutlined />
            <span
              className={classnames(`${prefixCls}-item-action-text`)}
              onClick={() => {
                setCurrentSelectedNode(node);
                modal.confirm({
                  title: intl.formatMessage(BASIC_INTL.DELETE_CONFIRM_TITLE, {
                    name: node.name,
                  }),
                  icon: <ExclamationCircleOutlined />,
                  content: intl.formatMessage(BASIC_INTL.DELETE_CONFIRM_CONTENT),
                  okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
                  centered: true,
                  okType: 'danger',
                  onOk: async () => doDelete(node.id),
                });
              }}
            >
              {intl.formatMessage(INTL.TREE_MENU_ITEM_REMOVE)}
            </span>
          </div>
        </div>
      ),
    };
    const menuItems = (): ItemType[] => {
      if (node.parentId !== 'root') {
        return [addItem, updateItem, moveItem, removeItem];
      }
      if (node.metadata.name === 'built-in') {
        return [addItem];
      }
      return [addItem, removeItem];
    };
    const menu = () => (
      <Menu
        className={classnames(`${prefixCls}-dropdown`)}
        onClick={({ domEvent }) => {
          domEvent.stopPropagation();
        }}
        items={menuItems()}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setDropdownId('');
        }}
      />
    );
    return (
      <Dropdown
        open={node.id === dropdownId}
        dropdownRender={menu}
        placement="bottom"
        trigger={['click', 'contextMenu']}
      >
        <span
          className={classnames(`${prefixCls}-dropdown-more`)}
          onClick={(e) => {
            e.stopPropagation();
            setDropdownId(node.id);
          }}
        >
          <MoreOutlined />
        </span>
      </Dropdown>
    );
  };

  const handleTitleRender = (node: DataNode) => {
    return (
      <div className={classnames(`${prefixCls}-item`)}>
        <div className={classnames(`${prefixCls}-item-title`)}>
          {HandleIcon(!node.isLeaf || node.parentId === 'root')}
          <Tooltip title={node.name}>
            <span>{node.name}</span>
          </Tooltip>
        </div>
        {optionsRender(node as DataNode)}
      </div>
    );
  };

  return (
    <div className={styles}>
      <Card
        style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
        bordered={false}
        className={classnames(`${prefixCls}`)}
      >
        <Skeleton loading={initLoading} paragraph={{ rows: 5 }}>
          <Spin spinning={loadRootOrgDataLoading || loadChildLoading}>
            <SearchTree
              handleTitleRender={handleTitleRender}
              onSearchChange={async (keyWord) => {
                beginSearching();
                if (!keyWord) {
                  endSearching();
                }
              }}
              onSelect={onSelect}
            />
            {!searching && (
              <div className={classnames(`${prefixCls}-tree`)}>
                <Tree<DataNode>
                  blockNode
                  fieldNames={{ key: 'id', title: 'name' }}
                  titleRender={handleTitleRender}
                  treeData={organizationData}
                  loadData={(treeNode) => loadChildren(treeNode.key)}
                  showLine={{ showLeafIcon: false }}
                  switcherIcon={<DownOutlined />}
                  selectedKeys={selectedKeys}
                  loadedKeys={loadedKeys}
                  onLoad={setLoadedKeys}
                  onSelect={(keys_, { node }) => {
                    setSelectedKeys(keys_);
                    onSelect(node.metadata.instanceId, node.name);
                  }}
                  onExpand={(keys) => {
                    setExpandedKeys(keys);
                    setAutoExpandParent(false);
                  }}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                />
              </div>
            )}
          </Spin>
        </Skeleton>
        {/* Create Department */}
        {currentSelectedNode && (
          <CreateDepartment
            key="createDept"
            visible={addModalVisible}
            currentNode={currentSelectedNode}
            onFinish={async () => {
              toggleAddModalVisible();
              await getRootOrganizationData({});
              return true;
            }}
            onCancel={() => {
              toggleAddModalVisible();
            }}
          />
        )}
        {/* Update Department */}
        {currentSelectedNode && (
          <CreateDepartment
            key="updateDept"
            visible={editModalVisible}
            edit={true}
            currentNode={currentSelectedNode}
            onFinish={async () => {
              toggleEditModalVisible();
              await getRootOrganizationData({});
              return true;
            }}
            onCancel={() => {
              toggleEditModalVisible();
            }}
          />
        )}
        {/* Move Department */}
        {currentSelectedNode && (
          <MoveTree
            key="moveDept"
            visible={moveModalVisible}
            currentNode={currentSelectedNode}
            onFinish={async () => {
              toggleMoveModalVisible();
              await getRootOrganizationData({});
              return true;
            }}
            onCancel={() => {
              toggleMoveModalVisible();
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default OrgTree;
