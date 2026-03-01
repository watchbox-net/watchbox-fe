/** 인물 요약 (ContentSummary → PERSON) */
export interface PersonSummary {
  contentId: number;
  mediaType: 'PERSON';
  popularity: number | null;
  profilePath: string | null;
  name: string;
  nameOriginal: string | null;
  knownForDepartment: string | null;
}
