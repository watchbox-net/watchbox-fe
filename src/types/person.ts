/** 인물 요약 (ContentSummary → PERSON) */
export interface PersonSummary {
  contentId: number;
  mediaType: 'PERSON';
  popularity: number | null;
  name: string;
  nameOriginal: string | null;
  knownForDepartment: string | null;
  profilePath: string | null;
}
