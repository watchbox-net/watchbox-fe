/**
 * 출연/제작 관련 DTO (상세 페이지)
 * BE: net.watchbox.domain.content.dto.detail.credit.person
 * Department는 @JsonValue로 한글 문자열로 직렬화되어 옴 (e.g. "배우", "감독")
 */

/** 출연 (Cast) */
export interface Cast {
  tmdbId: number;
  profilePath: string | null;
  /** 이름 (Korean) */
  name: string;
  /** 원래 이름 (English) */
  nameOriginal: string | null;
  /** 평소 활동 분야 (Department.koreanValue) */
  knownForDepartment: string | null;
  /** 배역 */
  character: string | null;
  /** 출연 순서 (낮을수록 주연) */
  order: number | null;
}

/** 제작 (Crew) */
export interface Crew {
  tmdbId: number;
  profilePath: string | null;
  /** 이름 (Korean) */
  name: string;
  /** 원래 이름 (English) */
  nameOriginal: string | null;
  /** 평소 활동 분야 (Department.koreanValue) */
  knownForDepartment: string | null;
  /** 이 작품에서의 역할 (Department.koreanValue 리스트) */
  departmentList: string[] | null;
}

/** 영화용 Credit */
export interface PersonCredit {
  castList: Cast[] | null;
  crewList: Crew[] | null;
  totalCount: number | null;
  castCount: number | null;
  crewCount: number | null;
}

/** TV 시리즈용 Credit (시즌별 누적) — 필드 동일 */
export interface AggregatePersonCredit {
  castList: Cast[] | null;
  crewList: Crew[] | null;
  totalCount: number | null;
  castCount: number | null;
  crewCount: number | null;
}

// ─── 인물 → 작품 (Work Credit) ──────────────────────────────────

/** 인물의 작품 역할 */
export type CreditRole = 'CAST' | 'CREW';

/** Movie/Tv Credit 공통 필드 */
interface BaseCombinedCredit {
  tmdbId: number;
  posterPath: string | null;
  creditRole: CreditRole;
  /** CAST일 때만 채워짐 (캐릭터명) */
  character: string | null;
  /** CREW일 때만 채워짐 (Department.koreanValue) */
  department: string | null;
  year: number | null;
  popularity: number | null;
}

/** 인물의 영화 작품 */
export interface MovieCredit extends BaseCombinedCredit {
  /** discriminator */
  watchMediaType: 'MOVIE';
  title: string;
  /** ISO date YYYY-MM-DD */
  releaseDate: string | null;
}

/** 인물의 TV 작품 */
export interface TvCredit extends BaseCombinedCredit {
  /** discriminator */
  watchMediaType: 'TV';
  name: string;
  /** ISO date YYYY-MM-DD */
  firstAirDate: string | null;
}

/** 인물의 작품 — watchMediaType으로 구분 (sealed in BE) */
export type CombinedCredit = MovieCredit | TvCredit;

/** 인물의 작품 응답 (최신 날짜순 정렬) */
export interface WorkCredit {
  combinedCreditList: CombinedCredit[] | null;
  totalCount: number | null;
}
