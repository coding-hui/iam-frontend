import React, { useState, Fragment } from 'react';
import { createApiKey } from '@/services/apikey/createApiKey';
import { PlusOutlined, CopyOutlined, CheckOutlined, CalendarOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, Modal, Form, Typography, Radio, App } from 'antd';
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
  COPY_SUCCESS: {
    id: 'apikeys.copy.success',
  },
  COPY_FAILED: {
    id: 'apikeys.copy.failed',
  },
  SAVE_TIP: {
    id: 'apikeys.save.tip',
  },
  CLOSE: {
    id: 'apikeys.button.close',
  },
  COPIED: {
    id: 'apikeys.button.copied',
  },
  COPY: {
    id: 'apikeys.button.copy',
  },
  NAME_PLACEHOLDER: {
    id: 'apikeys.form.name.placeholder',
  },
  NAME_TOOLTIP: {
    id: 'apikeys.form.name.tooltip',
  },
  EXPIRES_AT_TOOLTIP: {
    id: 'apikeys.form.expiresAt.tooltip',
  },
  NEVER_EXPIRE: {
    id: 'apikeys.expires.never',
  },
  CUSTOM: {
    id: 'apikeys.expires.custom',
  },
  EXPIRES_AT_PLACEHOLDER: {
    id: 'apikeys.form.expiresAt.placeholder',
  },
  SUCCESS_TITLE: {
    id: 'apikeys.create.success.title',
  },
};

const CreateApiKeyModal: React.FC<Props> = (props) => {
  const { onFinish } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [copiedKey, setCopiedKey] = useState(false);
  const [expiresAtOption, setExpiresAtOption] = useState<string>('custom');
  const [successResult, setSuccessResult] = useState<API.ApiKey | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleCopy = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      message.success(intl.formatMessage(INTL.COPY_SUCCESS));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error(intl.formatMessage(INTL.COPY_FAILED));
    }
  };

  const SuccessContent = ({ result }: { result: API.ApiKey }) => (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">{intl.formatMessage(INTL.SAVE_TIP)}</Typography.Text>
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
          {intl.formatMessage(INTL.CLOSE)}
        </Button>
        <Button
          type="primary"
          icon={copiedKey ? <CheckOutlined /> : <CopyOutlined />}
          onClick={() => handleCopy(result.key || '', setCopiedKey)}
        >
          {copiedKey ? intl.formatMessage(INTL.COPIED) : intl.formatMessage(INTL.COPY)}
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
            }
            // For 'never' option, expiresAtRFC3339 remains undefined

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
          placeholder={intl.formatMessage(INTL.NAME_PLACEHOLDER)}
          tooltip={intl.formatMessage(INTL.NAME_TOOLTIP)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(INTL.NAME_PLACEHOLDER),
            },
            {
              min: 2,
              max: 50,
              message: intl.formatMessage({ id: 'apikeys.form.name.lengthError' }),
            },
            {
              pattern: /^[a-zA-Z0-9\-_\s]+$/,
              message: intl.formatMessage({ id: 'apikeys.form.name.patternError' }),
            },
          ]}
          fieldProps={{
            maxLength: 50,
            showCount: true,
          }}
        />

        <Form.Item
          label={intl.formatMessage(INTL.EXPIRES_AT)}
          tooltip={intl.formatMessage(INTL.EXPIRES_AT_TOOLTIP)}
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
            >
              <Radio value="never">{intl.formatMessage(INTL.NEVER_EXPIRE)}</Radio>
              <Radio value="custom">{intl.formatMessage(INTL.CUSTOM)}</Radio>
            </Radio.Group>
          </div>
          {expiresAtOption === 'custom' && (
            <ProFormDatePicker
              name="expiresAt"
              placeholder={intl.formatMessage(INTL.EXPIRES_AT_PLACEHOLDER)}
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
        title={intl.formatMessage(INTL.SUCCESS_TITLE)}
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
