export enum ELEMENT_TYPE {
  /*[+]*/ TITLE, // Label
  // /*[+]*/ PARAGRAPH, // label + description
  /*[default]*/ INPUT, // Label + (conditions) + description + regex + max + default
  /*[default]*/ TEXT_AREA, // Label + (conditions) + description + max + default
  /*[default]*/ NUMBER_INPUT, // Label + (conditions) + description + *(regex) + min + max + default
  DROPDOWN, // Label + (conditions) + description + options (lista, url) + default
  /*[default/options]*/ RADIO_BUTTON, // Label + (conditions) + description + options + default
  /*[default/options]*/ CHECK_BOX, // Label + (conditions) + description + options + default
  /*[default/options]*/ SWITCH, // Label + (conditions) + description + options + default
  /*[+]*/ DATE, // Label + (conditions) + description + min + max
  /*[+]*/ TIME, // Label + (conditions) + description + min + max
  /*[+]*/ RATING, // Label + (conditions) + description + min + max
  /*[+]*/ IMAGE, // Label + (conditions - disable) + description + size + numberFiles
  /*[+]*/ SIGNATURE, // Label + (conditions - disable) + description
  /*[+]*/ QR, // Label + (conditions) + description
  /*[+]*/ AUDIO, // Label + (conditions) + description + size
  /*[fields]*/ CALCULATE, // Label + description = sadads + dasdasd = ;
  /*[default]*/ LOCATION, // Label + (conditions) + description + default
  /*[+]*/ FILES, // Label + (conditions) + description + size + numberFiles
  /*[+]*/ SECTION, // Label + description,
  /*[+]*/ CONTROLLER, // Label + description (NO PENSAR EN ESTO)
}
