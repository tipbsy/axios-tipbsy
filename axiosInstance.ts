import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

interface Config {
  env: string;
  baseURL: string;
}

interface GetParams {
  [key: string]: any;
}

interface PostData {
  [key: string]: any;
}

interface DeleteParams {
  [key: string]: any;
}

// 配置列表
const configs: Config[] = [
  { env: "development", baseURL: "https://www.development.com" },
  { env: "debug", baseURL: "https://www.debug.com" },
  { env: "production", baseURL: "https://www.production.com" },
];

// 创建 Axios 实例
function createAxiosInstance(config: Config): AxiosInstance {
  return axios.create({
    baseURL: config.baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 获取 Axios 实例
function getAxiosInstance(env: string): AxiosInstance {
  // @ts-ignore
  const selectedConfig = configs.find((cfg) => cfg.env === env);
  if (!selectedConfig) {
    throw new Error(`No configuration found for environment "${env}".`);
  }
  return createAxiosInstance(selectedConfig);
}

// 请求方法工厂
const createHttpMethod = <P = any, R = any>(method: "get" | "post" | "delete", instance: AxiosInstance) => {
  return (url: string, dataOrParams?: P, config?: AxiosRequestConfig) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const res = async () => {
      try {
        const paramsOrData = qs.stringify(dataOrParams);
        let response: AxiosResponse<R>;
        switch (method) {
          case "get":
            response = await instance.get<R>(url, {
              params: paramsOrData,
              signal,
              ...config,
            });
            break;
          case "post":
            response = await instance.post<R>(url, paramsOrData, {
              signal,
              ...config,
            });
            break;
          case "delete":
            response = await instance.delete<R>(url, {
              params: paramsOrData,
              signal,
              ...config,
            });
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return response;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(`${method.toUpperCase()} request canceled:`, error.message);
        } else {
          console.error(`${method.toUpperCase()} request error:`, error);
          throw error;
        }
      }
    };

    return { res, cancel: () => controller.abort() };
  };
};

// 封装请求的对象
const createHttpRequests = (env: string) => {
  const instance = getAxiosInstance(env);
  return {
    get: createHttpMethod<GetParams, any>(instance, "get"),
    post: createHttpMethod<PostData, any>(instance, "post"),
    delete: createHttpMethod<DeleteParams, any>(instance, "delete"),
  };
};

export default createHttpRequests;