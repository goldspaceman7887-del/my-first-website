export interface CampusGroup {
  universitySlug: string;
  name: string;
  meetingTime: string;
  location: string;
  language: string;
}

/** Example listings — illustrative, not real registered campus groups. */
export const campusGroups: CampusGroup[] = [
  { universitySlug: "waseda", name: "Waseda Gospel Circle", meetingTime: "Tue 6:30 PM", location: "Student Union Bldg, Rm 204", language: "Japanese / English" },
  { universitySlug: "waseda", name: "International Students Bible Study", meetingTime: "Fri 12:15 PM", location: "Okuma Garden lawn", language: "English" },
  { universitySlug: "sophia", name: "Sophia Faith & Questions Circle", meetingTime: "Wed 7:00 PM", location: "Library annex, Rm 3", language: "English" },
  { universitySlug: "keio", name: "Keio Small Group", meetingTime: "Thu 6:00 PM", location: "Mita campus, South Bldg", language: "Japanese" },
  { universitySlug: "meiji", name: "Meiji Explore Faith Circle", meetingTime: "Mon 5:30 PM", location: "Surugadai campus cafe", language: "Japanese" },
  { universitySlug: "rikkyo", name: "Rikkyo Bible Study", meetingTime: "Tue 7:00 PM", location: "Chapel annex", language: "Japanese / English" },
];

export function groupsForUniversity(slug: string): CampusGroup[] {
  return campusGroups.filter((g) => g.universitySlug === slug);
}
