import i18n from  '../../common/i18n/i18n';
import { FORMAT_LOCALES } from '../../common/constants/constants';

// Translate the name of the format locale and return the array sorted
export let FORMAT_LOCALES_I18N = () => {
  return FORMAT_LOCALES.map(locale => {
    return {code: locale.code, name: i18n.t(locale.name)};    
  }).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
};

export const SPORTS_AVAILABLE = () => {  
  return [
  {
    id: '',
    name: i18n.t('All Events'),
    icon: 'icon-calendar-check',
    favorite: true
  },
  {
    id: 'Soccer',
    name: i18n.t('Soccer'),
    icon: 'icon-soccer',
    favorite: true
  },
  {
    id: 'Basketball',
    name: i18n.t('Basketball'),
    icon: 'icon-basketball',
    favorite: true
  },
  {
    id: 'Football',
    name: i18n.t('Football'),
    icon: 'icon-football',
    favorite: true
  },
  {
    id: 'Hockey',
    name: i18n.t('Hockey'),
    icon: 'icon-hockey',
    favorite: true
  },  
  {
    id: 'Esports',
    name: i18n.t('Esports'),
    icon: 'icon-headphones',
    favorite: true
  },  
  {
    id: 'Aussie Rules',
    name: i18n.t('Aussie Rules'),
    icon: 'icon-football',
    favorite: false
  },
  {
    id: 'Baseball',
    name: i18n.t('Baseball'),
    icon: 'icon-baseball',
    favorite: false
  },
  {
    id: 'Boxing',
    name: i18n.t('Boxing'),
    icon: 'icon-walk',
    favorite: false
  },
  {
    id: 'Cricket',
    name: i18n.t('Cricket'),
    icon: 'icon-baseball',
    favorite: false
  },
  {
    id: 'Mixed Martial Arts',
    name: i18n.t('MMA'),
    icon: 'icon-bench-press',
    favorite: false
  },
  {
    id: 'Rugby League',
    name: i18n.t('Rugby League'),
    icon: 'icon-football',
    favorite: false
  },
  {
    id: 'Rugby Union',
    name: i18n.t('Rugby Union'),
    icon: 'icon-football',
    favorite: false
  }
]
};