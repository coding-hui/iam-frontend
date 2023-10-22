import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useIntl } from '@umijs/max';
import { Avatar, Skeleton, Upload, App, Row, Col, Form } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProDescriptions,
  ProForm,
  ProFormItem,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { uploadFile } from '@/services/system/upload';

import useStyle from './style';
import { omit } from 'lodash';
import { UpdateApplicationRequest } from '@/services/application';

export type Props = {
  appInfo?: App.Application;
  appInfoLoaded?: boolean;
  onUpdate: (record: UpdateApplicationRequest) => Promise<boolean>;
  getLogoColor: (name?: string, avatar?: string) => string;
};

const INTL = {
  BASIC_TITLE: {
    id: 'app.form.basicInfo.title',
  },
  NAME: {
    id: 'app.form.name',
  },
  LOGO: {
    id: 'app.form.logo',
  },
  DISPLAY_NAME: {
    id: 'app.form.displayName',
  },
  TYPE: {
    id: 'app.form.type',
  },
  DESCRIPTION: {
    id: 'app.form.description',
  },
  HOMEPAGE_URL: {
    id: 'app.form.homepageUrl',
  },
  LOGO_FILE_TYPE: {
    id: 'app.form.logo.fileType',
  },
  APP_ID: {
    id: 'app.form.appID',
  },
  APP_SECRET: {
    id: 'app.form.appSecret',
  },
  ENDPOINTS: {
    id: 'app.form.endpoints',
  },
};

const prefixCls = 'app-basic-info';

const Index: React.FC<Props> = (props) => {
  const intl = useIntl();
  const useApp = App.useApp();
  const [form] = Form.useForm<UpdateApplicationRequest>();
  const { styles } = useStyle(prefixCls);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadIconUrl, setUploadIconUrl] = useState<string>();

  const { appInfo, appInfoLoaded = false, onUpdate, getLogoColor } = props;

  useEffect(() => {
    if (appInfo) {
      form.setFieldsValue(appInfo);
    }
  }, [appInfo]);

  return (
    <ProCard layout="default" direction="column" className={styles.main}>
      <Skeleton loading={appInfoLoaded} active paragraph={{ rows: 5 }}>
        <ProForm<UpdateApplicationRequest>
          form={form}
          onFinish={onUpdate}
          colon={false}
          layout="vertical"
          style={{ marginBottom: 32 }}
        >
          <div className={`${prefixCls}-title`}>{intl.formatMessage(INTL.BASIC_TITLE)}</div>
          <Row gutter={0}>
            <Col flex="45%">
              <ProFormText
                width="xl"
                name="displayName"
                label={intl.formatMessage(INTL.DISPLAY_NAME)}
              />
              <ProFormText
                width="xl"
                name="homepageUrl"
                label={intl.formatMessage(INTL.HOMEPAGE_URL)}
              />
              <ProFormTextArea
                width="xl"
                name="description"
                label={intl.formatMessage(INTL.DESCRIPTION)}
              />
            </Col>
            <Col flex="auto">
              <ProForm.Group align="start">
                <ProFormItem label={intl.formatMessage(INTL.LOGO)}>
                  {appInfo ? (
                    <>
                      <Avatar
                        shape="square"
                        size={102}
                        src={appInfo && appInfo.logo ? appInfo.logo : null}
                        style={{
                          backgroundColor: getLogoColor(appInfo?.metadata.name, appInfo?.logo),
                        }}
                      >
                        {appInfo && appInfo.metadata.name
                          ? appInfo.metadata.name.substring(0, 5)
                          : ''}
                      </Avatar>
                      <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginTop: '8px' }}>
                        <span>{intl.formatMessage(INTL.LOGO_FILE_TYPE)}</span>
                      </div>{' '}
                    </>
                  ) : (
                    <div>
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        name="file"
                        className="avatar-uploader"
                        showUploadList={false}
                        accept="image/png, image/jpeg, image/jpg"
                        customRequest={async (files) => {
                          setUploadLoading(true);
                          if (!files.file) {
                            return;
                          }
                          const { success, result, message } = await uploadFile(files.file).finally(
                            () => {
                              setUploadLoading(false);
                            },
                          );
                          if (success && result) {
                            setUploadIconUrl(result);
                            return;
                          }
                          useApp.message.error(message);
                        }}
                      >
                        {uploadIconUrl ? (
                          <img src={uploadIconUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                          <div>
                            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>上传</div>
                          </div>
                        )}
                      </Upload>
                      <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                        <span>{intl.formatMessage(INTL.LOGO_FILE_TYPE)}</span>
                      </div>
                    </div>
                  )}
                </ProFormItem>
              </ProForm.Group>
            </Col>
          </Row>
        </ProForm>

        <div className={classNames(`${prefixCls}-descriptions`)}>
          <ProDescriptions<App.Application>
            column={2}
            title={intl.formatMessage(INTL.ENDPOINTS)}
            dataSource={omit(appInfo, 'config')}
            style={{ width: '80%', marginBottom: 32 }}
          >
            <ProDescriptions.Item
              dataIndex="appId"
              label={intl.formatMessage(INTL.APP_ID)}
              copyable
              editable={false}
            />
            <ProDescriptions.Item
              dataIndex="appSecret"
              label={intl.formatMessage(INTL.APP_SECRET)}
              copyable
              valueType="password"
              editable={false}
            />
          </ProDescriptions>
        </div>
      </Skeleton>
    </ProCard>
  );
};

export default Index;
