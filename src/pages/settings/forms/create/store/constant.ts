import { ELEMENT_TYPE } from '@/types/form';

export const ELEMENT_TYPE_VALUES = [
  {
    value: ELEMENT_TYPE.TITLE,
    label: 'l_title',
  },
  {
    value: ELEMENT_TYPE.INPUT,
    label: 'l_text_field',
  },
  {
    value: ELEMENT_TYPE.TEXT_AREA,
    label: 'l_textarea_field',
  },
  {
    value: ELEMENT_TYPE.NUMBER_INPUT,
    label: 'l_number_field',
  },
  {
    value: ELEMENT_TYPE.DROPDOWN,
    label: 'l_dropdown',
  },
  {
    value: ELEMENT_TYPE.RADIO_BUTTON,
    label: 'l_radio_button',
  },
  {
    value: ELEMENT_TYPE.CHECK_BOX,
    label: 'l_checkbox',
  },
  {
    value: ELEMENT_TYPE.SWITCH,
    label: 'l_switch',
  },
  {
    value: ELEMENT_TYPE.DATE,
    label: 'l_date',
  },
  {
    value: ELEMENT_TYPE.TIME,
    label: 'l_time',
  },
  {
    value: ELEMENT_TYPE.RATING,
    label: 'l_rating',
  },
  {
    value: ELEMENT_TYPE.IMAGE,
    label: 'l_image',
  },
  {
    value: ELEMENT_TYPE.SIGNATURE,
    label: 'l_signature',
  },
  {
    value: ELEMENT_TYPE.QR,
    label: 'l_qr_code',
  },
  {
    value: ELEMENT_TYPE.BARCODE,
    label: 'l_barcode',
  },
  {
    value: ELEMENT_TYPE.AUDIO,
    label: 'l_audio',
  },
  /*{
    value: ELEMENT_TYPE.CALCULATE,
    label: 'Calculate',
  },*/
  {
    value: ELEMENT_TYPE.LOCATION,
    label: 'l_location',
  },
  {
    value: ELEMENT_TYPE.FILES,
    label: 'l_files',
  },
];

export const REGEX_PATTERNS = [
  {
    value: '^[A-Za-z0-9]+$',
    label: 'l_alphanumeric_only',
  },
  {
    value: '^[A-Za-z]+$',
    label: 'l_letters_only',
  },
  {
    value: '^[0-9]+$',
    label: 'l_numbers_only',
  },
  {
    value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    label: 'l_email_pattern',
  },
  {
    value: '^(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$',
    label: 'l_phone_pattern',
  },
  {
    value:
      '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
    label: 'l_url_pattern',
  },
];

export const SWITCH_OPTIONS = [
  {
    value: 0,
    label: 'l_false',
  },
  {
    value: 1,
    label: 'l_true',
  },
];
