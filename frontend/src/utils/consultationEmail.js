export function openConsultationEmail(values) {
    const fields = [
        ['Name', values.name],
        ['Email', values.email],
        ['Company', values.company],
        ['Phone / WhatsApp', values.whatsapp],
        ['Service', values.service],
        ['Preferred contact channel', values.channel],
        ['Business challenge', values.challenge],
    ];

    const body = fields
        .filter(([, value]) => String(value || '').trim())
        .map(([label, value]) => `${label}: ${String(value).trim()}`)
        .join('\n\n');

    window.location.href =
        'mailto:agency@digitalgapco.com?subject=' +
        encodeURIComponent('DGAP consultation request') +
        '&body=' + encodeURIComponent(body);
}
