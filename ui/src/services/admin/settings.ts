import useSWR from 'swr';

import request from '@/utils/request';
import type * as Type from '@/common/interface';

export const useGeneralSetting = () => {
  const apiUrl = `/answer/admin/api/siteinfo/general`;
  const { data, error } = useSWR<Type.AdminSettingsGeneral, Error>(
    [apiUrl],
    request.instance.get,
  );

  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export const updateGeneralSetting = (params: Type.AdminSettingsGeneral) => {
  const apiUrl = `/answer/admin/api/siteinfo/general`;
  return request.put(apiUrl, params);
};

export const useThemeOptions = () => {
  const apiUrl = `/answer/admin/api/theme/options`;
  const { data, error } = useSWR<{ label: string; value: string }[]>(
    [apiUrl],
    request.instance.get,
  );
  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export const useInterfaceSetting = () => {
  const apiUrl = `/answer/admin/api/siteinfo/interface`;
  const { data, error } = useSWR<Type.AdminSettingsInterface, Error>(
    [apiUrl],
    request.instance.get,
  );
  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export const updateInterfaceSetting = (params: Type.AdminSettingsInterface) => {
  const apiUrl = `/answer/admin/api/siteinfo/interface`;
  return request.put(apiUrl, params);
};

export const useSmtpSetting = () => {
  const apiUrl = `/answer/admin/api/setting/smtp`;
  const { data, error } = useSWR<Type.AdminSettingsSmtp, Error>(
    [apiUrl],
    request.instance.get,
  );
  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export const updateSmtpSetting = (params: Type.AdminSettingsSmtp) => {
  const apiUrl = `/answer/admin/api/setting/smtp`;
  return request.put(apiUrl, params);
};

export const useDashBoard = () => {
  const apiUrl = `/answer/admin/api/dashboard`;
  const { data, error } = useSWR<Type.AdminDashboard, Error>(
    [apiUrl],
    request.instance.get,
  );
  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export const getAdminLanguageOptions = () => {
  const apiUrl = `/answer/admin/api/language/options`;
  return request.get<Type.LangsType[]>(apiUrl);
};
