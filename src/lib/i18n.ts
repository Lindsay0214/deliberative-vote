
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      // 主頁面
      'voting.system': '投票系統',
      'voting.description': '創建投票或參與投票，附上原因的投票會有更高權重',
      'create.new.poll': '創建新投票',
      'cancel.create': '取消創建',
      'no.polls': '還沒有任何投票，創建第一個投票吧！',
      
      // 創建投票表單
      'create.poll.form': '創建新投票',
      'poll.title': '投票主題',
      'poll.title.placeholder': '輸入投票主題...',
      'poll.description': '描述（可選）',
      'poll.description.placeholder': '輸入投票描述...',
      'poll.options': '投票選項',
      'option.placeholder': '選項',
      'add.option': '新增選項',
      'create.poll': '創建投票',
      
      // 投票卡片
      'vote.reason': '投票原因（可選，附上原因會增加投票權重）',
      'vote.reason.placeholder': '請說明您的投票原因...',
      'vote': '投票',
      'view.results': '查看結果',
      'voting.results': '投票結果',
      'total.votes': '總票數',
      'weighted.calculation': '加權計算',
      'votes': '票',
      'reason': '原因',
      'weight': '權重',
      'back.to.vote': '返回投票'
    }
  },
  en: {
    translation: {
      // Main page
      'voting.system': 'Voting System',
      'voting.description': 'Create polls or participate in voting. Votes with reasons have higher weight',
      'create.new.poll': 'Create New Poll',
      'cancel.create': 'Cancel Create',
      'no.polls': 'No polls yet, create the first one!',
      
      // Create poll form
      'create.poll.form': 'Create New Poll',
      'poll.title': 'Poll Title',
      'poll.title.placeholder': 'Enter poll title...',
      'poll.description': 'Description (Optional)',
      'poll.description.placeholder': 'Enter poll description...',
      'poll.options': 'Poll Options',
      'option.placeholder': 'Option',
      'add.option': 'Add Option',
      'create.poll': 'Create Poll',
      
      // Poll card
      'vote.reason': 'Voting Reason (Optional, providing reason increases vote weight)',
      'vote.reason.placeholder': 'Please explain your voting reason...',
      'vote': 'Vote',
      'view.results': 'View Results',
      'voting.results': 'Voting Results',
      'total.votes': 'Total Votes',
      'weighted.calculation': 'Weighted',
      'votes': 'votes',
      'reason': 'Reason',
      'weight': 'Weight',
      'back.to.vote': 'Back to Vote'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默認語言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
