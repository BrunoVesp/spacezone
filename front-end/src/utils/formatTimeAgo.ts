export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Há poucos segundos";
    if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? "s" : ""}`;
    if (days < 30) return `Há ${days} dia${days > 1 ? "s" : ""}`;
    if (months < 12) return `Há ${months} mês${months > 1 ? "es" : ""}`;

    return `Há ${years} ano${years > 1 ? "s" : ""}`;
}