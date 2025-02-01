export const upsertEvent = (events, data, editingId) => {
    if (editingId) {
        return events.map((event) =>
            event.id === editingId
                ? {
                      ...event,
                      ...data,
                      timestamp: data.timestamp
                          ? new Date(data.timestamp).getTime()
                          : event.timestamp,
                  }
                : event
        );
    } else {
        return [
            ...events,
            {
                ...data,
                id: String(events.length + 1),
                coverImage: data.coverImage || "",
                title: data.title || "",
                subTitle: data.subTitle || "",
                description: data.description || "",
                location: data.location || "",
                mode: data.mode || "offline",
                eligibility: data.eligibility || "",
                timestamp: data.timestamp
                    ? new Date(data.timestamp).getTime()
                    : Date.now(),
            },
        ];
    }
};
