// Коллекция предзаготовленных шаблонов для рассылок MailCraft
// Современная блочная архитектура (Tilda / Stripo style) + обратная совместимость

const PRESET_TEMPLATES = [
  {
    id: 'preset_welcome',
    category: 'welcome',
    categoryName: 'Онбординг клиентов',
    name: 'Приветственное письмо (Welcome)',
    tag: 'ONBOARDING',
    tagColor: '#0e4f5a',
    bgPreview: '#e6f0ee',
    badgeText: 'WELCOME',
    desc: 'Официальное приветствие нового клиента или подписчика с пошаговыми инструкциями для старта.',
    settings: {
      emailWidth: 600,
      outerBg: '#f7f7f4',
      canvasBg: '#ffffff',
      defaultFont: 'Arial, Helvetica, sans-serif',
      defaultColor: '#1e293b',
      borderRadius: 0,
      paddingY: 30
    },
    blocks: [
      {
        id: 'b_hdr_1',
        type: 'header',
        settings: {
          bg: '#ffffff',
          paddingTop: 30,
          paddingBottom: 20,
          align: 'left'
        },
        data: {
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=320&auto=format&fit=crop&q=80',
          logoWidth: 150,
          logoAlt: 'MailCraft Платформа',
          preheader: 'Ваш аккаунт успешно создан и готов к работе',
          showPreheader: true
        }
      },
      {
        id: 'b_txt_1',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 15,
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          content: '<h1 style="margin:0; font-family:Arial, sans-serif; font-size:26px; font-weight:800; color:#0e4f5a; line-height:1.3; text-transform:uppercase; letter-spacing:-0.5px;">Добро пожаловать в платформу</h1>'
        }
      },
      {
        id: 'b_img_1',
        type: 'image',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 20,
          paddingLeft: 30,
          paddingRight: 30,
          align: 'center'
        },
        data: {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
          alt: 'Обзор возможностей личного кабинета',
          width: '100%',
          link: 'https://example.com/dashboard'
        }
      },
      {
        id: 'b_txt_2',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 20,
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          content: '<p style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:15px; color:#334155; line-height:1.6;">Ваш аккаунт успешно активирован. Чтобы начать использование сервиса на полную мощность, выполните первые шаги по настройке профиля и подключению нужных модулей.</p><p style="margin:0; font-family:Arial, sans-serif; font-size:15px; color:#334155; line-height:1.6;">Служба заботы о клиентах всегда готова ответить на любые вопросы и помочь с интеграцией.</p>'
        }
      },
      {
        id: 'b_btn_1',
        type: 'button',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 30,
          align: 'left',
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          text: 'Перейти к настройке аккаунта',
          url: 'https://example.com/start',
          bgColor: '#0e4f5a',
          textColor: '#ffffff',
          borderRadius: 0,
          fontSize: 15,
          paddingV: 14,
          paddingH: 28,
          fullWidth: false
        }
      },
      {
        id: 'b_ftr_1',
        type: 'footer',
        settings: {
          bg: '#f8fafc',
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 30,
          paddingRight: 30,
          borderColor: '#e2e8f0',
          borderTop: 1
        },
        data: {
          company: 'Платформа автоматизации рассылок MailCraft',
          contacts: 'Служба поддержки: support@operator.com | 8 (800) 100-20-30',
          unsubscribeText: 'Вы получили это письмо, так как зарегистрировались на платформе. Если вы не хотите получать системные письма, вы можете <a href="https://example.com/unsubscribe" style="color:#0e4f5a; text-decoration:underline;">отписаться от рассылки</a>.'
        }
      }
    ]
  },
  {
    id: 'preset_promo',
    category: 'promo',
    categoryName: 'Промо и предложения',
    name: 'Специальное промо-предложение',
    tag: 'PROMO / SALE',
    tagColor: '#2563eb',
    bgPreview: '#0f172a',
    badgeText: 'SALE 50%',
    desc: 'Контрастный макет для акций, сезонных скидок и торговых предложений с акцентной кнопкой.',
    settings: {
      emailWidth: 600,
      outerBg: '#0a0a0a',
      canvasBg: '#111827',
      defaultFont: 'Arial, Helvetica, sans-serif',
      defaultColor: '#ffffff',
      borderRadius: 0,
      paddingY: 30
    },
    blocks: [
      {
        id: 'b_p_hdr',
        type: 'header',
        settings: {
          bg: '#111827',
          paddingTop: 30,
          paddingBottom: 15,
          align: 'center'
        },
        data: {
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=320&auto=format&fit=crop&q=80',
          logoWidth: 160,
          logoAlt: 'Enterprise Solutions',
          preheader: 'Закрытое спецпредложение до конца недели',
          showPreheader: true
        }
      },
      {
        id: 'b_p_txt1',
        type: 'text',
        settings: {
          bg: '#111827',
          paddingTop: 10,
          paddingBottom: 15,
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          content: '<h1 style="margin:0; font-family:Arial, sans-serif; font-size:28px; font-weight:800; color:#ffffff; line-height:1.25; text-align:center; text-transform:uppercase;">СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ ДЛЯ ПАРТНЕРОВ</h1>'
        }
      },
      {
        id: 'b_p_img',
        type: 'image',
        settings: {
          bg: '#111827',
          paddingTop: 10,
          paddingBottom: 20,
          paddingLeft: 30,
          paddingRight: 30,
          align: 'center'
        },
        data: {
          url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
          alt: 'Сезонное предложение со скидкой 50%',
          width: '100%',
          link: 'https://example.com/promo'
        }
      },
      {
        id: 'b_p_txt2',
        type: 'text',
        settings: {
          bg: '#111827',
          paddingTop: 10,
          paddingBottom: 25,
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          content: '<p style="margin:0 0 10px 0; font-family:Arial, sans-serif; font-size:15px; color:#94a3b8; line-height:1.6; text-align:center;">Сезонное снижение цен на ключевые направления цифровых решений. До конца недели доступна фиксация льготных условий на годовое обслуживание и подключение дополнительных модулей.</p>'
        }
      },
      {
        id: 'b_p_btn',
        type: 'button',
        settings: {
          bg: '#111827',
          paddingTop: 5,
          paddingBottom: 35,
          align: 'center',
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          text: 'Получить расчет стоимости',
          url: 'https://example.com/promo',
          bgColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: 0,
          fontSize: 16,
          paddingV: 15,
          paddingH: 36,
          fullWidth: false
        }
      },
      {
        id: 'b_p_ftr',
        type: 'footer',
        settings: {
          bg: '#0a0a0a',
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 30,
          paddingRight: 30,
          borderColor: '#1f2937',
          borderTop: 1
        },
        data: {
          company: 'Департамент клиентского сервиса Enterprise Solutions',
          contacts: 'sales@enterprise.com | +7 (495) 000-00-00',
          unsubscribeText: 'Предложение ограничено периодом проведения акции. Вы можете <a href="https://example.com/unsubscribe" style="color:#60a5fa; text-decoration:underline;">отписаться от рассылки</a> в любой момент.'
        }
      }
    ]
  },
  {
    id: 'preset_business',
    category: 'business',
    categoryName: 'B2B и корпоративные',
    name: 'Корпоративное предложение B2B',
    tag: 'B2B / PARTNERSHIP',
    tagColor: '#0a0a0a',
    bgPreview: '#f4f4f0',
    badgeText: 'B2B COMMERCIAL',
    desc: 'Строгий минималистичный стиль для деловой переписки, коммерческих соглашений и партнерских предложений.',
    settings: {
      emailWidth: 600,
      outerBg: '#f4f4f0',
      canvasBg: '#ffffff',
      defaultFont: 'Arial, Helvetica, sans-serif',
      defaultColor: '#0a0a0a',
      borderRadius: 0,
      paddingY: 30
    },
    blocks: [
      {
        id: 'b_b2b_hdr',
        type: 'header',
        settings: {
          bg: '#ffffff',
          paddingTop: 30,
          paddingBottom: 20,
          align: 'left'
        },
        data: {
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=320&auto=format&fit=crop&q=80',
          logoWidth: 150,
          logoAlt: 'Global Capital B2B',
          preheader: 'Индивидуальные условия сотрудничества для вашей компании',
          showPreheader: true
        }
      },
      {
        id: 'b_b2b_t1',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 15,
          paddingLeft: 35,
          paddingRight: 35
        },
        data: {
          content: '<h2 style="margin:0; font-family:Arial, sans-serif; font-size:24px; font-weight:800; color:#0a0a0a; line-height:1.3; text-transform:uppercase;">Персональное предложение для вашей компании</h2>'
        }
      },
      {
        id: 'b_b2b_t2',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 25,
          paddingLeft: 35,
          paddingRight: 35
        },
        data: {
          content: '<p style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:15px; color:#334155; line-height:1.6;">Уважаемый партнер!<br><br>Мы подготовили для вас комплексную программу оптимизации бизнес-процессов и персональную тарифную сетку для корпоративных клиентов.</p><p style="margin:0; font-family:Arial, sans-serif; font-size:15px; color:#334155; line-height:1.6;">Предлагаем ознакомиться с презентацией и согласовать короткий 15-минутный звонок для обсуждения деталей внедрения.</p>'
        }
      },
      {
        id: 'b_b2b_btn',
        type: 'button',
        settings: {
          bg: '#ffffff',
          paddingTop: 5,
          paddingBottom: 35,
          align: 'left',
          paddingLeft: 35,
          paddingRight: 35
        },
        data: {
          text: 'Ознакомиться с презентацией',
          url: 'https://example.com/b2b',
          bgColor: '#0a0a0a',
          textColor: '#ffffff',
          borderRadius: 0,
          fontSize: 15,
          paddingV: 14,
          paddingH: 28,
          fullWidth: false
        }
      },
      {
        id: 'b_b2b_ftr',
        type: 'footer',
        settings: {
          bg: '#f8fafc',
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 35,
          paddingRight: 35,
          borderColor: '#e2e8f0',
          borderTop: 1
        },
        data: {
          company: 'Департамент корпоративного развития Global Capital',
          contacts: 'corp@global.com | +7 (495) 000-00-00',
          unsubscribeText: 'Вы получили это письмо как представитель партнерской организации. Чтобы отписаться от рассылки, перейдите по <a href="https://example.com/unsubscribe" style="color:#0a0a0a; text-decoration:underline;">ссылке для отписки</a>.'
        }
      }
    ]
  },
  {
    id: 'preset_digest',
    category: 'digest',
    categoryName: 'Аналитика и дайджесты',
    name: 'Аналитический дайджест',
    tag: 'ANALYTICS / DIGEST',
    tagColor: '#2563eb',
    bgPreview: '#eff6ff',
    badgeText: 'MONTHLY REPORT',
    desc: 'Структурированный информационный дайджест с четкими колонками, ключевыми показателями и выводами.',
    settings: {
      emailWidth: 600,
      outerBg: '#f7f7f4',
      canvasBg: '#ffffff',
      defaultFont: 'Arial, Helvetica, sans-serif',
      defaultColor: '#0a0a0a',
      borderRadius: 0,
      paddingY: 30
    },
    blocks: [
      {
        id: 'b_dig_hdr',
        type: 'header',
        settings: {
          bg: '#ffffff',
          paddingTop: 30,
          paddingBottom: 20,
          align: 'left'
        },
        data: {
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=320&auto=format&fit=crop&q=80',
          logoWidth: 150,
          logoAlt: 'Industry Index Digest',
          preheader: 'Главные показатели индустрии за прошедший месяц',
          showPreheader: true
        }
      },
      {
        id: 'b_dig_t1',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 15,
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          content: '<h2 style="margin:0; font-family:Arial, sans-serif; font-size:24px; font-weight:800; color:#0a0a0a; line-height:1.3; text-transform:uppercase;">Главные показатели индустрии: Ежемесячный дайджест</h2>'
        }
      },
      {
        id: 'b_dig_cols',
        type: 'columns_2',
        settings: {
          bg: '#f8fafc',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
          gap: 20
        },
        data: {
          col1: {
            title: '01. B2B Конверсия',
            text: 'Рост открываемости табличных шаблонов на 24% в сегменте корпоративной почты.',
            imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=280&auto=format&fit=crop&q=80',
            imgAlt: 'График аналитики'
          },
          col2: {
            title: '02. Доставляемость',
            text: 'Автоматическая валидация спам-фильтров обеспечивает 99.2% попадания в Inbox.',
            imgUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=280&auto=format&fit=crop&q=80',
            imgAlt: 'Показатели доставляемости'
          }
        }
      },
      {
        id: 'b_dig_btn',
        type: 'button',
        settings: {
          bg: '#ffffff',
          paddingTop: 20,
          paddingBottom: 30,
          align: 'left',
          paddingLeft: 30,
          paddingRight: 30
        },
        data: {
          text: 'Читать полный аналитический отчет',
          url: 'https://example.com/digest',
          bgColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: 0,
          fontSize: 15,
          paddingV: 14,
          paddingH: 28,
          fullWidth: false
        }
      },
      {
        id: 'b_dig_ftr',
        type: 'footer',
        settings: {
          bg: '#ffffff',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 30,
          paddingRight: 30,
          borderColor: '#e2e8f0',
          borderTop: 1
        },
        data: {
          company: 'Аналитический центр исследований почтовой инфраструктуры',
          contacts: 'digest@industry.com | Москва, Пресненская наб. 12',
          unsubscribeText: 'Вы получили эту подписку на основе регистрации на сайте. Вы можете <a href="https://example.com/unsubscribe" style="color:#2563eb; text-decoration:underline;">отписаться от рассылки</a>.'
        }
      }
    ]
  },
  {
    id: 'preset_event',
    category: 'event',
    categoryName: 'Конференции и события',
    name: 'Приглашение на конференцию',
    tag: 'EVENT / WEBINAR',
    tagColor: '#b86d29',
    bgPreview: '#fdf6ee',
    badgeText: 'CONFERENCE 2026',
    desc: 'Архитектурный макет приглашения на онлайн-трансляцию, панельную дискуссию или закрытый митап.',
    settings: {
      emailWidth: 600,
      outerBg: '#f7f7f4',
      canvasBg: '#ffffff',
      defaultFont: 'Arial, Helvetica, sans-serif',
      defaultColor: '#0a0a0a',
      borderRadius: 0,
      paddingY: 30
    },
    blocks: [
      {
        id: 'b_ev_hdr',
        type: 'header',
        settings: {
          bg: '#ffffff',
          paddingTop: 30,
          paddingBottom: 15,
          align: 'left'
        },
        data: {
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=320&auto=format&fit=crop&q=80',
          logoWidth: 150,
          logoAlt: 'Annual Summit 2026',
          preheader: 'Закрытый митап для ведущих архитекторов решений',
          showPreheader: true
        }
      },
      {
        id: 'b_ev_t1',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 15,
          paddingLeft: 35,
          paddingRight: 35
        },
        data: {
          content: '<h1 style="margin:0; font-family:Arial, sans-serif; font-size:26px; font-weight:800; color:#b86d29; line-height:1.25; text-transform:uppercase;">Ежегодная конференция: Архитектура решений 2026</h1>'
        }
      },
      {
        id: 'b_ev_img',
        type: 'image',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 20,
          paddingLeft: 35,
          paddingRight: 35,
          align: 'center'
        },
        data: {
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
          alt: 'Конференция 2026',
          width: '100%',
          link: 'https://example.com/summit'
        }
      },
      {
        id: 'b_ev_t2',
        type: 'text',
        settings: {
          bg: '#ffffff',
          paddingTop: 10,
          paddingBottom: 25,
          paddingLeft: 35,
          paddingRight: 35
        },
        data: {
          content: '<p style="margin:0 0 10px 0; font-family:Arial, sans-serif; font-size:15px; color:#334155; line-height:1.6;"><strong>Дата:</strong> Четверг, 19:00 (МСК)<br><strong>Формат:</strong> Онлайн-трансляция + закрытая сессия вопросов и ответов с экспертами.</p><p style="margin:0; font-family:Arial, sans-serif; font-size:15px; color:#334155; line-height:1.6;">Зарегистрируйтесь заранее, чтобы получить доступ к раздаточным материалам и закрытому чату участников.</p>'
        }
      },
      {
        id: 'b_ev_btn',
        type: 'button',
        settings: {
          bg: '#ffffff',
          paddingTop: 5,
          paddingBottom: 35,
          align: 'left',
          paddingLeft: 35,
          paddingRight: 35
        },
        data: {
          text: 'Зарегистрироваться на саммит',
          url: 'https://example.com/summit',
          bgColor: '#b86d29',
          textColor: '#ffffff',
          borderRadius: 0,
          fontSize: 15,
          paddingV: 14,
          paddingH: 30,
          fullWidth: false
        }
      },
      {
        id: 'b_ev_ftr',
        type: 'footer',
        settings: {
          bg: '#f8fafc',
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 35,
          paddingRight: 35,
          borderColor: '#e2e8f0',
          borderTop: 1
        },
        data: {
          company: 'Оргкомитет конференции Архитектура решений',
          contacts: 'summit@annual.com | support@annual.com',
          unsubscribeText: 'Вы получили это приглашение по подписке на IT-события. Чтобы отказаться от писем, нажмите <a href="https://example.com/unsubscribe" style="color:#b86d29; text-decoration:underline;">отписаться от рассылки</a>.'
        }
      }
    ]
  }
];

// Адаптер для преобразования старого формата состояния в блоки конструктора
function convertLegacyStateToBlocks(state) {
  if (!state) return [];
  if (Array.isArray(state.blocks) && state.blocks.length > 0) {
    return state.blocks;
  }

  const blocks = [];

  // Логотип / Шапка
  if (state.logoUrl) {
    blocks.push({
      id: 'block_' + Math.random().toString(36).substr(2, 9),
      type: 'header',
      settings: {
        bg: state.cardBgColor || '#ffffff',
        paddingTop: 30,
        paddingBottom: 15,
        align: state.logoX && state.logoX > 150 ? 'center' : 'left'
      },
      data: {
        logoUrl: state.logoUrl,
        logoWidth: state.logoWidth || 160,
        logoAlt: 'Логотип компании',
        preheader: '',
        showPreheader: false
      }
    });
  }

  // Заголовок
  if (state.headerText) {
    blocks.push({
      id: 'block_' + Math.random().toString(36).substr(2, 9),
      type: 'text',
      settings: {
        bg: state.cardBgColor || '#ffffff',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 35,
        paddingRight: 35
      },
      data: {
        content: `<h1 style="margin:0; font-family:Arial, sans-serif; font-size:${state.headerFontSize || 26}px; font-weight:800; color:${state.headerColor || '#0a0a0a'}; text-align:${state.headerAlign || 'left'}; line-height:1.25;">${state.headerText.replace(/\n/g, '<br>')}</h1>`
      }
    });
  }

  // Тело письма
  if (state.bodyText) {
    const formattedBody = state.bodyText.split('\n\n').map(p => `<p style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:${state.bodyFontSize || 15}px; color:${state.bodyColor || '#334155'}; line-height:1.6; text-align:${state.bodyAlign || 'left'};">${p.replace(/\n/g, '<br>')}</p>`).join('');
    blocks.push({
      id: 'block_' + Math.random().toString(36).substr(2, 9),
      type: 'text',
      settings: {
        bg: state.cardBgColor || '#ffffff',
        paddingTop: 10,
        paddingBottom: 20,
        paddingLeft: 35,
        paddingRight: 35
      },
      data: {
        content: formattedBody
      }
    });
  }

  // Кнопка
  if (state.buttonText) {
    blocks.push({
      id: 'block_' + Math.random().toString(36).substr(2, 9),
      type: 'button',
      settings: {
        bg: state.cardBgColor || '#ffffff',
        paddingTop: 10,
        paddingBottom: 30,
        align: state.headerAlign || 'left',
        paddingLeft: 35,
        paddingRight: 35
      },
      data: {
        text: state.buttonText,
        url: state.buttonUrl || '#',
        bgColor: state.buttonBgColor || '#1e50ff',
        textColor: state.buttonTextColor || '#ffffff',
        borderRadius: 0,
        fontSize: 15,
        paddingV: 14,
        paddingH: 30,
        fullWidth: false
      }
    });
  }

  // Подвал
  if (state.footerText) {
    blocks.push({
      id: 'block_' + Math.random().toString(36).substr(2, 9),
      type: 'footer',
      settings: {
        bg: state.cardBgColor || '#ffffff',
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 35,
        paddingRight: 35,
        borderColor: '#e5e5df',
        borderTop: 1
      },
      data: {
        company: 'MailCraft Рассылки',
        contacts: state.footerText.replace(/\n/g, '<br>'),
        unsubscribeText: 'Если вы больше не хотите получать письма, вы можете <a href="https://example.com/unsubscribe" style="color:#1e50ff; text-decoration:underline;">отписаться от рассылки</a>.'
      }
    });
  }

  return blocks;
}

if (typeof window !== 'undefined') {
  window.PRESET_TEMPLATES = PRESET_TEMPLATES;
  window.convertLegacyStateToBlocks = convertLegacyStateToBlocks;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRESET_TEMPLATES,
    convertLegacyStateToBlocks
  };
}
