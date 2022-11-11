import React, { FC, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import type * as Type from '@/common/interface';
import { useToast } from '@/hooks';
import { siteInfoStore } from '@/stores';
import { useGeneralSetting, updateGeneralSetting } from '@/services';

import '../index.scss';

const General: FC = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'admin.general',
  });
  const Toast = useToast();
  const updateSiteInfo = siteInfoStore((state) => state.update);

  const { data: setting } = useGeneralSetting();
  const [formData, setFormData] = useState<Type.FormDataType>({
    name: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    site_url: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    short_description: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    description: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    contact_email: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
  });
  const checkValidated = (): boolean => {
    let ret = true;
    const { name, site_url, contact_email } = formData;
    if (!name.value) {
      ret = false;
      formData.name = {
        value: '',
        isInvalid: true,
        errorMsg: t('name.msg'),
      };
    }
    if (!site_url.value) {
      ret = false;
      formData.site_url = {
        value: '',
        isInvalid: true,
        errorMsg: t('site_url.msg'),
      };
    } else if (!/^(https?):\/\/([\w.]+\/?)\S*$/.test(site_url.value)) {
      ret = false;
      formData.site_url = {
        value: formData.site_url.value,
        isInvalid: true,
        errorMsg: t('site_url.validate'),
      };
    }

    if (!contact_email.value) {
      ret = false;
      formData.contact_email = {
        value: '',
        isInvalid: true,
        errorMsg: t('contact_email.msg'),
      };
    } else if (
      !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
        contact_email.value,
      )
    ) {
      ret = false;
      formData.contact_email = {
        value: formData.contact_email.value,
        isInvalid: true,
        errorMsg: t('contact_email.validate'),
      };
    }
    setFormData({
      ...formData,
    });
    return ret;
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (checkValidated() === false) {
      return;
    }
    const reqParams: Type.AdminSettingsGeneral = {
      name: formData.name.value,
      description: formData.description.value,
      short_description: formData.short_description.value,
      site_url: formData.site_url.value,
      contact_email: formData.contact_email.value,
    };

    updateGeneralSetting(reqParams)
      .then(() => {
        Toast.onShow({
          msg: t('update', { keyPrefix: 'toast' }),
          variant: 'success',
        });
        updateSiteInfo(reqParams);
      })
      .catch((err) => {
        if (err.isError && err.key) {
          formData[err.key].isInvalid = true;
          formData[err.key].errorMsg = err.value;
        }
        setFormData({ ...formData });
      });
  };
  const onFieldChange = (fieldName, fieldValue) => {
    if (!formData[fieldName]) {
      return;
    }
    const fieldData: Type.FormDataType = {
      [fieldName]: {
        value: fieldValue,
        isInvalid: false,
        errorMsg: '',
      },
    };
    setFormData({ ...formData, ...fieldData });
  };
  useEffect(() => {
    if (!setting) {
      return;
    }
    const formMeta = {};
    Object.keys(setting).forEach((k) => {
      formMeta[k] = { ...formData[k], value: setting[k] };
    });
    setFormData({ ...formData, ...formMeta });
  }, [setting]);
  return (
    <>
      <h3 className="mb-4">{t('page_title')}</h3>
      <Form noValidate onSubmit={onSubmit}>
        <Form.Group controlId="siteName" className="mb-3">
          <Form.Label>{t('name.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.name.value}
            isInvalid={formData.name.isInvalid}
            onChange={(evt) => onFieldChange('name', evt.target.value)}
          />
          <Form.Text as="div">{t('name.text')}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formData.name.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="siteUrl" className="mb-3">
          <Form.Label>{t('site_url.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.site_url.value}
            isInvalid={formData.site_url.isInvalid}
            onChange={(evt) => onFieldChange('site_url', evt.target.value)}
          />
          <Form.Text as="div">{t('site_url.text')}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formData.site_url.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="shortDescription" className="mb-3">
          <Form.Label>{t('short_description.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.short_description.value}
            isInvalid={formData.short_description.isInvalid}
            onChange={(evt) =>
              onFieldChange('short_description', evt.target.value)
            }
          />
          <Form.Text as="div">{t('short_description.text')}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formData.short_description.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>{t('description.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.description.value}
            isInvalid={formData.description.isInvalid}
            onChange={(evt) => onFieldChange('description', evt.target.value)}
          />
          <Form.Text as="div">{t('description.text')}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formData.description.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="contact_email" className="mb-3">
          <Form.Label>{t('contact_email.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.contact_email.value}
            isInvalid={formData.contact_email.isInvalid}
            onChange={(evt) => onFieldChange('contact_email', evt.target.value)}
          />
          <Form.Text as="div">{t('contact_email.text')}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formData.contact_email.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('save', { keyPrefix: 'btns' })}
        </Button>
      </Form>
    </>
  );
};

export default General;
