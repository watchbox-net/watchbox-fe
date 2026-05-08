import type { WorkCredit } from './credit';

/**
 * 인물 상세 정보 (ContentInfo → PERSON)
 * BE: net.watchbox.domain.content.dto.detail.PersonInfo
 */
export interface PersonInfo {
  contentId: number | null;
  tmdbId: number;

  profilePath: string | null;
  /** 한글 이름 */
  nameKo: string;
  /** 영문 이름 */
  nameEn: string | null;
  /** 원래 이름 (출신국 언어) */
  nameOriginal: string | null;
  /** ISO date YYYY-MM-DD */
  birthday: string | null;
  /** 나이 (생년월일로 계산) */
  age: number | null;
  /** 출생지 */
  placeOfBirth: string | null;
  /** Department.koreanValue */
  knownForDepartment: string | null;
  /** 소개 */
  biography: string | null;

  // append_to_response
  workCredit: WorkCredit | null;
  profilePathList: string[] | null;
}

/** 인물 요약 (ContentSummary → PERSON) */
export interface PersonSummary {
  contentId: number | null;
  tmdbId: number;
  mediaType: 'PERSON';
  popularity: number | null;
  profilePath: string | null;
  name: string;           // nameKo
  nameOriginal: string | null;
  /** Department.koreanValue (e.g. "배우", "감독") */
  knownForDepartment: string | null;
}
