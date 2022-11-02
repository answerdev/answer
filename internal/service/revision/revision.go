package revision

import (
	"context"
	"github.com/answerdev/answer/internal/entity"
	"xorm.io/xorm"
)

// RevisionRepo revision repository
type RevisionRepo interface {
	AddRevision(ctx context.Context, revision *entity.Revision, autoUpdateRevisionID bool) (err error)
	GetLastRevisionByObjectID(ctx context.Context, objectID string) (revision *entity.Revision, exist bool, err error)
	GetRevisionList(ctx context.Context, revision *entity.Revision) (revisionList []entity.Revision, err error)
	UpdateObjectRevisionId(ctx context.Context, revision *entity.Revision, session *xorm.Session) (err error)
}
