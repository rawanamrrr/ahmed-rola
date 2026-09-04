import { useLanguage } from '@/contexts/LanguageContext';

type TranslationKey =
  | 'loading'
  | 'ourSpecialDay'
  | 'countingMoments'
  | 'joinUsAt'
  | 'date'
  | 'time'
  | 'location'
  | 'rsvpTitle'
  | 'rsvpDescription'
  | 'rsvpButton'
  | 'rsvpFormTitle'
  | 'rsvpFormName'
  | 'rsvpFormEmail'
  | 'rsvpFormGuests'
  | 'rsvpFormSubmit'
  | 'rsvpSuccess'
  | 'rsvpError'
  | 'muteMusic'
  | 'unmuteMusic'
  | 'venueMapTitle'
  | 'venueMapLoading'
  | 'venueMapError'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'writeUsMessage'
  | 'writeUsDescription'
  | 'yourName'
  | 'yourMessage'
  | 'clearDrawing'
  | 'undo'
  | 'sendMessage'
  | 'messageSent'
  | 'messageError'
  | 'footerMessage'
  | 'sendingMessage'
  | 'drawnMessage'
  | 'writtenMessage'
  | 'writeYourMessage'
  | 'color'
  | 'width'
  | 'colorBlack'
  | 'colorRed'
  | 'colorBlue'
  | 'colorGreen'
  | 'colorPurple'
  | 'colorOrange'
  | 'widthThin'
  | 'widthMedium'
  | 'widthThick'
  | 'widthBold'
  | 'current'
  | 'size'
  | 'copyright'
  | 'madeBy'
  | 'sharePhotosTitle'
  | 'sharePhotosDescription'
  | 'uploadButton'
  | 'scanQRCode'
  | 'orUploadDirectly'
  | 'timelineTitle'
  | 'timelineDate'
  | 'timelineItem1Title'
  | 'timelineItem1Time'
  | 'timelineItem2Title'
  | 'timelineItem2Time'
  | 'timelineItem3Title'
  | 'timelineItem3Time'
  | 'timelineItem4Title'
  | 'timelineItem4Time';

type Translations = {
  [key in TranslationKey]: {
    en: string;
    ar: string;
  };
};

export const translations: Translations = {
  loading: {
    en: 'Loading invitation...',
    ar: 'جاري تحميل الدعوة...',
  },
  ourSpecialDay: {
    en: 'Our Special Day',
    ar: 'يومنا الخاص',
  },
  countingMoments: {
    en: 'Counting every moment to celebrate with you',
    ar: 'نعد كل لحظة للاحتفال معكم',
  },
  joinUsAt: {
    en: 'Join Us At',
    ar: 'نلتقي في',
  },
  date: {
    en: 'September 11, 2026',
    ar: '١١ سبتمبر ٢٠٢٦',
  },
  time: {
    en: '9:00 PM',
    ar: '٩:٠٠ مساءً',
  },
  location: {
    en: 'Boulevard Palace, Kafr El-Sheikh, Egypt',
    ar: 'قصر البوليفارد، كفر الشيخ، مصر',
  },
  rsvpTitle: {
    en: 'Will You Join Us?',
    ar: 'هل ستنضم إلينا؟',
  },
  rsvpDescription: {
    en: 'We would be honored to have you celebrate with us on our special day',
    ar: 'سيكون لنا الشرف بوجودكم معنا في يومنا الخاص',
  },
  rsvpButton: {
    en: 'RSVP Now',
    ar: 'تأكيد الحضور',
  },
  rsvpFormTitle: {
    en: 'RSVP Form',
    ar: 'نموذج تأكيد الحضور',
  },
  rsvpFormName: {
    en: 'Your Name',
    ar: 'الاسم',
  },
  rsvpFormEmail: {
    en: 'Email Address',
    ar: 'البريد الإلكتروني',
  },
  rsvpFormGuests: {
    en: 'Number of Guests',
    ar: 'عدد الضيوف',
  },
  rsvpFormSubmit: {
    en: 'Submit',
    ar: 'إرسال',
  },
  rsvpSuccess: {
    en: 'Thank you for your RSVP!',
    ar: 'شكراً لتأكيد حضوركم!',
  },
  rsvpError: {
    en: 'Please fill in all fields',
    ar: 'الرجاء ملء جميع الحقول',
  },
  muteMusic: {
    en: 'Mute background music',
    ar: 'كتم الموسيقى',
  },
  unmuteMusic: {
    en: 'Unmute background music',
    ar: 'إعادة تشغيل الموسيقى',
  },
  venueMapTitle: {
    en: 'Venue Location',
    ar: 'موقع القاعة',
  },
  venueMapLoading: {
    en: 'Loading map...',
    ar: 'جاري تحميل الخريطة...',
  },
  venueMapError: {
    en: 'Failed to load map',
    ar: 'فشل تحميل الخريطة',
  },
  days: {
    en: 'Days',
    ar: 'أيام',
  },
  hours: {
    en: 'Hours',
    ar: 'ساعات',
  },
  minutes: {
    en: 'Minutes',
    ar: 'دقائق',
  },
  seconds: {
    en: 'Seconds',
    ar: 'ثواني',
  },
  writeUsMessage: {
    en: 'Write Us a Message',
    ar: 'اكتبوا لنا رسالة',
  },
  writeUsDescription: {
    en: 'Leave us a handwritten note or message',
    ar: 'اتركوا لنا رسالة بخط اليد',
  },
  drawnMessage: {
    en: 'Drawn Message',
    ar: 'رسالة مرسومة',
  },
  writtenMessage: {
    en: 'Written Message',
    ar: 'رسالة مكتوبة',
  },
  writeYourMessage: {
    en: 'Write your message here...',
    ar: 'اكتب رسالتك هنا...',
  },
  yourName: {
    en: 'Your Name',
    ar: 'اسمك',
  },
  yourMessage: {
    en: 'Your Message',
    ar: 'رسالتك',
  },
  clearDrawing: {
    en: 'Clear',
    ar: 'مسح',
  },
  undo: {
    en: 'Undo',
    ar: 'تراجع',
  },
  sendMessage: {
    en: 'Send Message',
    ar: 'إرسال الرسالة',
  },
  messageSent: {
    en: 'Message sent successfully!',
    ar: 'تم إرسال الرسالة بنجاح!',
  },
  messageError: {
    en: 'Please enter your name and write a message',
    ar: 'الرجاء إدخال الاسم وكتابة رسالة',
  },
  footerMessage: {
    en: "can't wait to celebrate with you",
    ar: 'لا نطيق الانتظار للاحتفال معكم'
  },
  sendingMessage: {
    en: 'Sending your message...',
    ar: 'جاري إرسال رسالتك...',
  },
  color: {
    en: 'Color',
    ar: 'اللون',
  },
  width: {
    en: 'Width',
    ar: 'السُمك',
  },
  colorBlack: {
    en: 'Black',
    ar: 'أسود',
  },
  colorRed: {
    en: 'Red',
    ar: 'أحمر',
  },
  colorBlue: {
    en: 'Blue',
    ar: 'أزرق',
  },
  colorGreen: {
    en: 'Green',
    ar: 'أخضر',
  },
  colorPurple: {
    en: 'Purple',
    ar: 'بنفسجي',
  },
  colorOrange: {
    en: 'Orange',
    ar: 'برتقالي',
  },
  widthThin: {
    en: 'Thin',
    ar: 'رفيع',
  },
  widthMedium: {
    en: 'Medium',
    ar: 'متوسط',
  },
  widthThick: {
    en: 'Thick',
    ar: 'سميك',
  },
  widthBold: {
    en: 'Bold',
    ar: 'عريض',
  },
  current: {
    en: 'Current',
    ar: 'الحالي',
  },
  size: {
    en: 'Size',
    ar: 'الحجم',
  },
  copyright: {
    en: 'All Rights Reserved.',
    ar: 'جميع الحقوق محفوظة. ',
  },
  madeBy: {
    en: 'Made by',
    ar: 'صنع بواسطة',
  },
  sharePhotosTitle: {
    en: 'Share Your Photos From The Day',
    ar: 'شاركونا صوركم من اليوم',
  },
  sharePhotosDescription: {
    en: 'Upload the photos you take during our celebration so we can cherish these memories together',
    ar: 'ارفعوا الصور التي التقطوها خلال احتفالنا لنحتفظ بهذه الذكريات معاً',
  },
  uploadButton: {
    en: 'Upload Your Photos',
    ar: 'ارفع صورك',
  },
  scanQRCode: {
    en: 'Scan QR Code to Upload Your Photos',
    ar: 'امسح الرمز لرفع صورك',
  },
  orUploadDirectly: {
    en: 'Or click below to upload your photos directly',
    ar: 'أو اضغط أدناه لرفع صورك مباشرة',
  },
  timelineTitle: {
    en: 'Timeline',
    ar: 'الجدول الزمني للحفل',
  },
  timelineDate: {
    en: 'SEPTEMBER 11, 2026',
    ar: '١١ سبتمبر ٢٠٢٦',
  },
  timelineItem1Title: {
    en: 'Welcome & Starting',
    ar: 'الترحيب والبداية',
  },
  timelineItem1Time: {
    en: '09:00 PM',
    ar: '٠٩:٠٠ مساءً',
  },
  timelineItem2Title: {
    en: 'Dinner Time',
    ar: 'وقت العشاء',
  },
  timelineItem2Time: {
    en: '10:30 PM',
    ar: '١٠:٣٠ مساءً',
  },
  timelineItem3Title: {
    en: 'The Second Part of the Wedding',
    ar: 'الجزء الثاني من الحفل',
  },
  timelineItem3Time: {
    en: '11:30 PM',
    ar: '١١:٣٠ مساءً',
  },
  timelineItem4Title: {
    en: 'Little Photos for Big Memories',
    ar: 'صور صغيرة لذكريات كبيرة',
  },
  timelineItem4Time: {
    en: '01:00 AM',
    ar: '٠١:٠٠ صباحاً',
  },
};

export function useTranslation() {
  const { language } = useLanguage();

  return function t(key: TranslationKey): string {
    return translations[key][language];
  };
}