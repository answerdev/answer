package siteinfo

import (
	"context"
	"encoding/json"

	"github.com/answerdev/answer/internal/base/constant"
	"github.com/answerdev/answer/internal/base/reason"
	"github.com/answerdev/answer/internal/base/translator"
	"github.com/answerdev/answer/internal/entity"
	"github.com/answerdev/answer/internal/schema"
	"github.com/answerdev/answer/internal/service/export"
	"github.com/answerdev/answer/internal/service/siteinfo_common"
	"github.com/jinzhu/copier"
	"github.com/segmentfault/pacman/errors"
)

type SiteInfoService struct {
	siteInfoRepo siteinfo_common.SiteInfoRepo
	emailService *export.EmailService
}

func NewSiteInfoService(siteInfoRepo siteinfo_common.SiteInfoRepo, emailService *export.EmailService) *SiteInfoService {
	return &SiteInfoService{
		siteInfoRepo: siteInfoRepo,
		emailService: emailService,
	}
}

// GetSiteGeneral get site info general
func (s *SiteInfoService) GetSiteGeneral(ctx context.Context) (resp *schema.SiteGeneralResp, err error) {
	siteInfo, exist, err := s.siteInfoRepo.GetByType(ctx, constant.SiteTypeGeneral)
	if err != nil {
		return nil, err
	}
	if !exist {
		return nil, errors.BadRequest(reason.SiteInfoNotFound)
	}

	resp = &schema.SiteGeneralResp{}
	_ = json.Unmarshal([]byte(siteInfo.Content), resp)
	return resp, nil
}

// GetSiteInterface get site info interface
func (s *SiteInfoService) GetSiteInterface(ctx context.Context) (resp *schema.SiteInterfaceResp, err error) {
	siteInfo, exist, err := s.siteInfoRepo.GetByType(ctx, constant.SiteTypeInterface)
	if err != nil {
		return nil, err
	}
	if !exist {
		return nil, errors.BadRequest(reason.SiteInfoNotFound)
	}
	resp = &schema.SiteInterfaceResp{}
	_ = json.Unmarshal([]byte(siteInfo.Content), resp)
	return resp, nil
}

func (s *SiteInfoService) SaveSiteGeneral(ctx context.Context, req schema.SiteGeneralReq) (err error) {
	req.FormatSiteUrl()
	var (
		siteType = "general"
		content  []byte
	)
	content, _ = json.Marshal(req)

	data := entity.SiteInfo{
		Type:    siteType,
		Content: string(content),
	}

	err = s.siteInfoRepo.SaveByType(ctx, siteType, &data)
	return
}

func (s *SiteInfoService) SaveSiteInterface(ctx context.Context, req schema.SiteInterfaceReq) (err error) {
	var (
		siteType   = "interface"
		themeExist bool
		content    []byte
	)

	// check theme
	for _, theme := range schema.GetThemeOptions {
		if theme.Value == req.Theme {
			themeExist = true
			break
		}
	}
	if !themeExist {
		err = errors.BadRequest(reason.ThemeNotFound)
		return
	}

	// check language
	if !translator.CheckLanguageIsValid(req.Language) {
		err = errors.BadRequest(reason.LangNotFound)
		return
	}

	content, _ = json.Marshal(req)

	data := entity.SiteInfo{
		Type:    siteType,
		Content: string(content),
	}

	err = s.siteInfoRepo.SaveByType(ctx, siteType, &data)
	return
}

// GetSMTPConfig get smtp config
func (s *SiteInfoService) GetSMTPConfig(ctx context.Context) (
	resp *schema.GetSMTPConfigResp, err error,
) {
	emailConfig, err := s.emailService.GetEmailConfig()
	if err != nil {
		return nil, err
	}
	resp = &schema.GetSMTPConfigResp{}
	_ = copier.Copy(resp, emailConfig)
	return resp, nil
}

// UpdateSMTPConfig get smtp config
func (s *SiteInfoService) UpdateSMTPConfig(ctx context.Context, req *schema.UpdateSMTPConfigReq) (err error) {
	oldEmailConfig, err := s.emailService.GetEmailConfig()
	if err != nil {
		return err
	}
	_ = copier.Copy(oldEmailConfig, req)

	err = s.emailService.SetEmailConfig(oldEmailConfig)
	if err != nil {
		return err
	}
	if len(req.TestEmailRecipient) > 0 {
		title, body, err := s.emailService.TestTemplate(ctx)
		if err != nil {
			return err
		}
		go s.emailService.Send(ctx, req.TestEmailRecipient, title, body, "", "")
	}
	return
}
