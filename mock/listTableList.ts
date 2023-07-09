import { Request, Response } from 'express';
import { parse } from 'url';

// mock tableListDataSource
const genList = (current: number, limit: number) => {
  const tableListDataSource: API.UserInfo[] = [];

  for (let i = 0; i < limit; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      metadata: {
        name: `TradeCode ${index}`,
        instanceId: 'user-' + i,
      },
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, limit = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.UserInfo & {
      sorter: any;
      filter: any;
    };

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (limit as number),
    (current as number) * (limit as number),
  );
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return (Object.keys(filter) as Array<keyof API.UserInfo>).some((key) => {
          if (!filter[key]) {
            return true;
          }
          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }
          return false;
        });
      });
    }
  }

  if (params.metadata?.name) {
    dataSource = dataSource.filter(
      (data) =>
        data.metadata &&
        params.metadata &&
        data.metadata.name?.includes(params.metadata.name || ''),
    );
  }
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    limit,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(
        (item) => key.indexOf(item.metadata?.instanceId) === -1,
      );
      break;
    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule: API.UserInfo = {
          metadata: {
            name: name,
            instanceId: 'user-' + i,
          },
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.metadata?.name === key) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/rule': getRule,
  'POST /api/rule': postRule,
};
