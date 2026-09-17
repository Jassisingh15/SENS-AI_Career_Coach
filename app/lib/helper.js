// Convert a resume section's entries into the markdown saved in the database.
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) {
    return "";
  }

  const formattedEntries = entries.map((entry) => {
    let dateRange = `${entry.startDate} - ${entry.endDate}`;

    if (entry.current) {
      dateRange = `${entry.startDate} - Present`;
    }

    return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
  });

  return `## ${type}\n\n${formattedEntries.join("\n\n")}`;
}
