import { FC } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type * as Type from '@/common/interface';

interface IProps {
  data: Type.AdminDashboard['info'];
}

const HealthStatus: FC<IProps> = ({ data }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin.dashboard' });
  const { version, remote_version } = data.version_info || {};
  const isLatest = version === remote_version;
  return (
    <Card className="mb-4">
      <Card.Body>
        <h6 className="mb-3">{t('site_health_status')}</h6>
        <Row>
          <Col xs={6} className="mb-1 d-flex align-items-center">
            <span className="text-secondary me-1">{t('version')}</span>
            <strong>{version}</strong>
            {isLatest && (
              <Badge pill bg="success" className="ms-1">
                {t('latest')}
              </Badge>
            )}
            {!isLatest && remote_version && (
              <Badge pill bg="warning" text="dark" className="ms-1">
                {t('update_to')} {remote_version}
              </Badge>
            )}
            {!isLatest && !remote_version && (
              <Badge pill bg="danger" className="ms-1">
                {t('check_failed')}
              </Badge>
            )}
          </Col>
          <Col xs={6} className="mb-1">
            <span className="text-secondary me-1">{t('https')}</span>
            <strong>{data.https ? t('yes') : t('yes')}</strong>
          </Col>
          <Col xs={6} className="mb-1">
            <span className="text-secondary me-1">{t('uploading_files')}</span>
            <strong>
              {data.uploading_files ? t('allowed') : t('not_allowed')}
            </strong>
          </Col>
          <Col xs={6}>
            <span className="text-secondary me-1">{t('smtp')}</span>
            {data.smtp ? (
              <strong>{t('enabled')}</strong>
            ) : (
              <Link to="/admin/smtp" className="ms-2">
                {t('config')}
              </Link>
            )}
          </Col>
          <Col xs={6}>
            <span className="text-secondary me-1">{t('timezone')}</span>
            <strong>{data.time_zone}</strong>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default HealthStatus;
