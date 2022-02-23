export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", { hour12: true });
};

export const formatDob = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vie-VN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });
};
