
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
      'all.polls': '所有投票',
      'my.polls': '我的投票',
      'no.my.polls': '您還沒有建立任何投票',
      'create.first.poll': '建立第一個投票',
      'please.login.to.view': '請先登入查看您的投票',
      'please.login.to.create': '請登入以建立投票',
      'loading': '載入中...',
      
      // 認證相關
      'login.with.google': '使用 Google 登入',
      'logout': '登出',
      'welcome': '歡迎',
      
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
      'poll.expires': '投票期限（可選）',
      'select.expire.date': '選擇期限日期',
      'clear.expire': '清除期限',
      
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
      'back.to.vote': '返回投票',
      'expired': '已截止',
      'expires.at': '截止',
      'created.at': '發起時間',
      'voted.successfully': '投票成功',
      'vote.recorded': '您的投票已經記錄',
      'already.voted': '已經投過票',
      'already.voted.desc': '您已經在這個投票中投過票了',
      'vote.failed': '投票失敗',
      'vote.failed.desc': '無法提交投票，請稍後再試',
      'please.login.to.vote': '請先登入',
      'login.required.vote': '您需要登入才能投票',
      
      // 創建投票相關
      'poll.created': '投票建立成功',
      'poll.created.desc': '您的投票已經建立並發布',
      'poll.create.failed': '建立失敗',
      'poll.create.failed.desc': '無法建立投票，請稍後再試',
      'please.login.to.create.poll': '請先登入',
      'login.required.create': '您需要登入才能建立投票',
      
      // 錯誤訊息
      'error': '錯誤',
      'error.load.polls': '無法載入投票'
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
      'all.polls': 'All Polls',
      'my.polls': 'My Polls',
      'no.my.polls': 'You haven\'t created any polls yet',
      'create.first.poll': 'Create First Poll',
      'please.login.to.view': 'Please login to view your polls',
      'please.login.to.create': 'Please login to create polls',
      'loading': 'Loading...',
      
      // Authentication
      'login.with.google': 'Login with Google',
      'logout': 'Logout',
      'welcome': 'Welcome',
      
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
      'poll.expires': 'Poll Expiry (Optional)',
      'select.expire.date': 'Select expiry date',
      'clear.expire': 'Clear expiry',
      
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
      'back.to.vote': 'Back to Vote',
      'expired': 'Expired',
      'expires.at': 'Expires',
      'created.at': 'Created',
      'voted.successfully': 'Voted Successfully',
      'vote.recorded': 'Your vote has been recorded',
      'already.voted': 'Already Voted',
      'already.voted.desc': 'You have already voted in this poll',
      'vote.failed': 'Vote Failed',
      'vote.failed.desc': 'Unable to submit vote, please try again later',
      'please.login.to.vote': 'Please Login First',
      'login.required.vote': 'You need to login to vote',
      
      // Create poll related
      'poll.created': 'Poll Created Successfully',
      'poll.created.desc': 'Your poll has been created and published',
      'poll.create.failed': 'Creation Failed',
      'poll.create.failed.desc': 'Unable to create poll, please try again later',
      'please.login.to.create.poll': 'Please Login First',
      'login.required.create': 'You need to login to create polls',
      
      // Error messages
      'error': 'Error',
      'error.load.polls': 'Unable to load polls'
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
