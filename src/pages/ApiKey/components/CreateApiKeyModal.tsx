import React, { useState, Fragment } from 'react';
import { createApiKey } from '@/services/apikey/createApiKey';
import { PlusOutlined, CopyOutlined, CheckOutlined, CalendarOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, Modal, Form, Typography, Radio, message } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { BASIC_INTL } from '@/constant';

export type Props = {
  onFinish?: () => Promise<boolean>;
};

const INTL = {
  CREATE_TITLE: {
    id: 'apikeys.create.title',
  },
  CREATE_BUTTON: {
    id: 'apikeys.create.button',
  },
  NAME: {
    id: 'apikeys.form.name',
  },
  EXPIRES_AT: {
    id: 'apikeys.form.expiresAt',
  },
};

const CreateApiKeyModal: React.FC<Props> = (props) => {
  const { onFinish } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const [copiedKey, setCopiedKey] = useState(false);
  const [expiresAtOption, setExpiresAtOption] = useState<string>('custom');
  const [successResult, setSuccessResult] = useState<API.ApiKey | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleCopy = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      message.success('复制成功');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error('复制失败');
    }
  };

  const SuccessContent = ({ result }: { result: API.ApiKey }) => (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">
          请妥善保存此 API Key，创建后将无法再次查看
        </Typography.Text>
      </div>

      <div
        style={{
          background: '#f5f5f5',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
        }}
      >
        <Typography.Text
          style={{
            fontFamily:
              '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
            fontSize: '14px',
            wordBreak: 'break-all',
            lineHeight: '1.5',
          }}
        >
          {result.key}
        </Typography.Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button
          onClick={() => {
            setSuccessResult(null);
            setCopiedKey(false);
            setExpiresAtOption('custom');
            form.resetFields();
          }}
        >
          关闭
        </Button>
        <Button
          type="primary"
          icon={copiedKey ? <CheckOutlined /> : <CopyOutlined />}
          onClick={() => handleCopy(result.key || '', setCopiedKey)}
        >
          {copiedKey ? '已复制' : '复制'}
        </Button>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
        <FormattedMessage {...INTL.CREATE_BUTTON} />
      </Button>

      <ModalForm<API.CreateApiKeyRequest>
        title={intl.formatMessage(INTL.CREATE_TITLE)}
        open={createModalVisible}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          width: 480,
          maskClosable: false,
          keyboard: false,
        }}
        submitTimeout={3000}
        onFinish={async (values) => {
          try {
            // Handle expiresAt based on selected option
            let expiresAtRFC3339 = undefined;
            if (expiresAtOption === 'custom' && values.expiresAt) {
              // For custom date, set time to end of day
              const date = new Date(values.expiresAt);
              date.setHours(23, 59, 59, 999);
              expiresAtRFC3339 = date.toISOString();
            } else if (expiresAtOption !== 'never') {
              // For preset options, calculate the date
              const now = new Date();
              switch (expiresAtOption) {
                case '7days':
                  now.setDate(now.getDate() + 7);
                  break;
                case '30days':
                  now.setDate(now.getDate() + 30);
                  break;
                case '90days':
                  now.setDate(now.getDate() + 90);
                  break;
                case '1year':
                  now.setFullYear(now.getFullYear() + 1);
                  break;
              }
              now.setHours(23, 59, 59, 999);
              expiresAtRFC3339 = now.toISOString();
            }

            const requestData: API.CreateApiKeyRequest = {
              name: values.name,
              expiresAt: expiresAtRFC3339,
            };

            const result = await createApiKey(requestData);

            if (result) {
              message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));

              if (result.key) {
                setSuccessResult(result);
                setCreateModalVisible(false); // 关闭创建模态框
                // 重置表单状态
                form.resetFields();
                setExpiresAtOption('custom');
              }

              if (onFinish) {
                await onFinish();
              }
              return false; // 返回 false 让 ModalForm 关闭
            } else {
              message.error(intl.formatMessage(BASIC_INTL.CREATE_FAILED));
              return false;
            }
          } catch (error) {
            message.error(intl.formatMessage(BASIC_INTL.CREATE_FAILED));
            return false;
          }
        }}
        onOpenChange={(open) => {
          setCreateModalVisible(open);
          if (!open) {
            setCopiedKey(false);
            setExpiresAtOption('custom');
          }
        }}
      >
        <ProFormText
          name="name"
          label={intl.formatMessage(INTL.NAME)}
          placeholder="请输入 API Key 名称"
          tooltip="用于识别此 API Key 的用途，建议使用描述性的名称"
          rules={[
            {
              required: true,
              message: '请输入 API Key 名称',
            },
            {
              min: 2,
              max: 50,
              message: '名称长度应在 2-50 个字符之间',
            },
            {
              pattern: /^[a-zA-Z0-9\-_\s]+$/,
              message: '名称只能包含字母、数字、连字符、下划线和空格',
            },
          ]}
          fieldProps={{
            maxLength: 50,
            showCount: true,
          }}
        />

        <Form.Item
          label={intl.formatMessage(INTL.EXPIRES_AT)}
          tooltip="设置过期时间可以增强安全性，如果不设置，此 API Key 将永久有效"
        >
          <div style={{ marginBottom: 16 }}>
            <Radio.Group
              value={expiresAtOption}
              onChange={(e) => {
                const value = e.target.value;
                setExpiresAtOption(value);
                if (value !== 'custom') {
                  form.setFieldValue('expiresAt', null);
                }
              }}
              optionType="button"
              buttonStyle="solid"
              size="middle"
              options={[
                { label: '永不过期', value: 'never' },
                { label: '7天', value: '7days' },
                { label: '30天', value: '30days' },
                { label: '90天', value: '90days' },
                { label: '1年', value: '1year' },
                { label: '自定义', value: 'custom' },
              ]}
            />
          </div>
          {expiresAtOption === 'custom' && (
            <ProFormDatePicker
              name="expiresAt"
              placeholder="请选择过期日期"
              fieldProps={{
                format: 'YYYY-MM-DD',
                disabledDate: (current: any) => {
                  return current && current < new Date().setHours(0, 0, 0, 0);
                },
                style: {
                  width: '100%',
                },
                size: 'large',
                allowClear: true,
                suffixIcon: <CalendarOutlined />,
              }}
            />
          )}
        </Form.Item>
      </ModalForm>

      <Modal
        title="API Key 创建成功"
        open={!!successResult}
        width={480}
        footer={null}
        maskClosable={false}
        keyboard={false}
        onCancel={() => {
          setSuccessResult(null);
          setCopiedKey(false);
          setExpiresAtOption('custom');
          form.resetFields();
        }}
      >
        {successResult && <SuccessContent result={successResult} />}
      </Modal>
    </Fragment>
  );
};

export default CreateApiKeyModal;
