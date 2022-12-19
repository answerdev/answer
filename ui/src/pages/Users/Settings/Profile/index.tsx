import React, { FormEvent, useState, useEffect } from 'react';
import { Form, Button, Stack, ButtonGroup } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import { marked } from 'marked';
import MD5 from 'md5';

import type { FormDataType } from '@/common/interface';
import { UploadImg, Avatar, Icon } from '@/components';
import { loggedUserInfoStore } from '@/stores';
import { useToast } from '@/hooks';
import { modifyUserInfo, getLoggedUserInfo } from '@/services';
import { handleFormError } from '@/utils';

const Index: React.FC = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings.profile',
  });
  const toast = useToast();
  const { user, update } = loggedUserInfoStore();
  const [mailHash, setMailHash] = useState('');
  const [count] = useState(0);

  const [formData, setFormData] = useState<FormDataType>({
    display_name: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    username: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    avatar: {
      type: 'default',
      gravatar: '',
      custom: '',
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    bio: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    website: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    location: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
  });

  const handleChange = (params: FormDataType) => {
    setFormData({ ...formData, ...params });
  };
  const handleAvatarChange = (evt) => {
    const { value: v } = evt.currentTarget;
    if (v === 'gravatar') {
      handleChange({
        avatar: {
          ...formData.avatar,
          type: 'gravatar',
          gravatar: `https://www.gravatar.com/avatar/${mailHash}`,
          isInvalid: false,
          errorMsg: '',
        },
      });
    }
    if (v === 'custom') {
      handleChange({
        avatar: {
          ...formData.avatar,
          type: 'custom',
          isInvalid: false,
          errorMsg: '',
        },
      });
    }
    if (v === 'default') {
      handleChange({
        avatar: {
          ...formData.avatar,
          type: 'default',
          isInvalid: false,
          errorMsg: '',
        },
      });
    }
  };

  const avatarUpload = (path: string) => {
    setFormData({
      ...formData,
      avatar: {
        ...formData.avatar,
        type: 'custom',
        custom: path,
        isInvalid: false,
        errorMsg: '',
      },
    });
  };
  const removeCustomAvatar = () => {
    setFormData({
      ...formData,
      avatar: {
        ...formData.avatar,
        custom: '',
        isInvalid: false,
        errorMsg: '',
      },
    });
  };

  const checkValidated = (): boolean => {
    let bol = true;
    const { display_name, website, username } = formData;
    if (!display_name.value) {
      bol = false;
      formData.display_name = {
        value: '',
        isInvalid: true,
        errorMsg: t('display_name.msg'),
      };
    } else if ([...display_name.value].length > 30) {
      bol = false;
      formData.display_name = {
        value: display_name.value,
        isInvalid: true,
        errorMsg: t('display_name.msg_range'),
      };
    }

    if (!username.value) {
      bol = false;
      formData.username = {
        value: '',
        isInvalid: true,
        errorMsg: t('username.msg'),
      };
    } else if ([...username.value].length > 30) {
      bol = false;
      formData.username = {
        value: username.value,
        isInvalid: true,
        errorMsg: t('username.msg_range'),
      };
    } else if (/[^a-z0-9\-._]/.test(username.value)) {
      bol = false;
      formData.username = {
        value: username.value,
        isInvalid: true,
        errorMsg: t('username.character'),
      };
    }

    if (formData.avatar.type === 'custom' && !formData.avatar.custom) {
      bol = false;
      formData.avatar = {
        ...formData.avatar,
        custom: '',
        value: '',
        isInvalid: true,
        errorMsg: t('avatar.msg'),
      };
    }

    const reg = /^(http|https):\/\//g;
    if (website.value && !website.value.match(reg)) {
      bol = false;
      formData.website = {
        value: formData.website.value,
        isInvalid: true,
        errorMsg: t('website.msg'),
      };
    }
    setFormData({
      ...formData,
    });
    return bol;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!checkValidated()) {
      return;
    }

    const params = {
      display_name: formData.display_name.value,
      username: formData.username.value,
      avatar: {
        type: formData.avatar.type,
        gravatar: formData.avatar.gravatar,
        custom: formData.avatar.custom,
      },
      bio: formData.bio.value,
      website: formData.website.value,
      location: formData.location.value,
      bio_html: marked.parse(formData.bio.value),
    };

    modifyUserInfo(params)
      .then(() => {
        update({
          ...user,
          ...params,
        });
        toast.onShow({
          msg: t('update', { keyPrefix: 'toast' }),
          variant: 'success',
        });
      })
      .catch((err) => {
        if (err.isError) {
          const data = handleFormError(err, formData);
          setFormData({ ...data });
        }
      });
  };

  const getProfile = () => {
    getLoggedUserInfo().then((res) => {
      formData.display_name.value = res.display_name;
      formData.username.value = res.username;
      formData.bio.value = res.bio;
      formData.avatar.type = res.avatar.type || 'default';
      formData.avatar.gravatar = res.avatar.gravatar;
      formData.avatar.custom = res.avatar.custom;
      formData.location.value = res.location;
      formData.website.value = res.website;
      setFormData({ ...formData });
      if (res.e_mail) {
        const str = res.e_mail.toLowerCase().trim();
        const hash = MD5(str);
        setMailHash(hash);
      }
    });
  };

  // const refreshGravatar = () => {
  //   setCount((pre) => pre + 1);
  // };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <h3 className="mb-4">{t('heading')}</h3>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="displayName" className="mb-3">
          <Form.Label>{t('display_name.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.display_name.value}
            isInvalid={formData.display_name.isInvalid}
            onChange={(e) =>
              handleChange({
                display_name: {
                  value: e.target.value,
                  isInvalid: false,
                  errorMsg: '',
                },
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            {formData.display_name.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="userName" className="mb-3">
          <Form.Label>{t('username.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            value={formData.username.value}
            isInvalid={formData.username.isInvalid}
            onChange={(e) =>
              handleChange({
                username: {
                  value: e.target.value,
                  isInvalid: false,
                  errorMsg: '',
                },
              })
            }
          />
          <Form.Text as="div">{t('username.caption')}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formData.username.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('avatar.label')}</Form.Label>
          <div className="mb-3">
            <Form.Select
              name="avatar.type"
              value={formData.avatar.type}
              onChange={handleAvatarChange}>
              <option value="gravatar" key="gravatar">
                {t('avatar.gravatar')}
              </option>
              <option value="default" key="default">
                {t('avatar.default')}
              </option>
              <option value="custom" key="custom">
                {t('avatar.custom')}
              </option>
            </Form.Select>
          </div>
          <div className="d-flex">
            {formData.avatar.type === 'gravatar' && (
              <Stack>
                <Avatar
                  size="160px"
                  avatar={formData.avatar.gravatar}
                  searchStr={`s=256&d=identicon${
                    count > 0 ? `&t=${new Date().valueOf()}` : ''
                  }`}
                  className="me-3 rounded"
                />
                <Form.Text className="text-muted mt-1">
                  <Trans i18nKey="settings.profile.avatar.gravatar_text">
                    You can change image on
                    <a
                      href="https://gravatar.com"
                      target="_blank"
                      rel="noreferrer">
                      gravatar.com
                    </a>
                  </Trans>
                </Form.Text>
              </Stack>
            )}

            {formData.avatar.type === 'custom' && (
              <Stack>
                <Stack direction="horizontal" className="align-items-start">
                  <Avatar
                    size="160px"
                    searchStr="s=256"
                    avatar={formData.avatar.custom}
                    className="me-2 bg-gray-300 "
                  />
                  <ButtonGroup vertical className="fit-content">
                    <UploadImg type="avatar" uploadCallback={avatarUpload}>
                      <Icon name="cloud-upload" />
                    </UploadImg>
                    <Button
                      variant="outline-secondary"
                      onClick={removeCustomAvatar}>
                      <Icon name="trash" />
                    </Button>
                  </ButtonGroup>
                </Stack>
                <Form.Text className="text-muted mt-1">
                  <Trans i18nKey="settings.profile.avatar.text">
                    You can upload your image.
                  </Trans>
                </Form.Text>
              </Stack>
            )}
            {formData.avatar.type === 'default' && (
              <Avatar size="160px" avatar="" />
            )}
          </div>
          <Form.Control
            isInvalid={formData.avatar.isInvalid}
            className="d-none"
          />
          <Form.Control.Feedback type="invalid">
            {formData.avatar.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="bio" className="mb-3">
          <Form.Label>{t('bio.label')}</Form.Label>
          <Form.Control
            className="font-monospace"
            required
            as="textarea"
            rows={5}
            value={formData.bio.value}
            isInvalid={formData.bio.isInvalid}
            onChange={(e) =>
              handleChange({
                bio: {
                  value: e.target.value,
                  isInvalid: false,
                  errorMsg: '',
                },
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            {formData.bio.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="website" className="mb-3">
          <Form.Label>{t('website.label')}</Form.Label>
          <Form.Control
            required
            type="url"
            placeholder={t('website.placeholder')}
            value={formData.website.value}
            isInvalid={formData.website.isInvalid}
            onChange={(e) =>
              handleChange({
                website: {
                  value: e.target.value,
                  isInvalid: false,
                  errorMsg: '',
                },
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            {formData.website.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>{t('location.label')}</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder={t('location.placeholder')}
            value={formData.location.value}
            isInvalid={formData.location.isInvalid}
            onChange={(e) =>
              handleChange({
                location: {
                  value: e.target.value,
                  isInvalid: false,
                  errorMsg: '',
                },
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            {formData.location.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('btn_name')}
        </Button>
      </Form>
    </>
  );
};

export default React.memo(Index);
