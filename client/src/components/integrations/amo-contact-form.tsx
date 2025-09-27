import { useEffect } from 'react';

const INLINE_SCRIPT_ID = 'amo-contact-form-inline';
const REMOTE_SCRIPT_ID = 'amoforms_script_1606946';

export function AmoContactFormScript() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (document.getElementById(REMOTE_SCRIPT_ID)) {
      return;
    }

    const inline = document.createElement('script');
    inline.id = INLINE_SCRIPT_ID;
    inline.type = 'text/javascript';
    inline.innerHTML =
      '!function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"1606946",hash:"17f79bb968b59627003ae90cfe7ecd61",locale:"ru"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");';

    const remote = document.createElement('script');
    remote.id = REMOTE_SCRIPT_ID;
    remote.async = true;
    remote.charset = 'utf-8';
    remote.src = 'https://forms.amocrm.ru/forms/assets/js/amoforms.js?1758988528';

    document.head?.appendChild(inline);
    document.head?.appendChild(remote);

    return () => {
      inline.remove();
      remote.remove();
    };
  }, []);

  return null;
}
