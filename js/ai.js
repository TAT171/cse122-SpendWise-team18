const AI = {
  VERSION: 'v2.0',

  DISCLAIMER:
    'Kết quả này mang tính định hướng giáo dục, không thay thế quyết định tài chính cá nhân. ' +
    'SpendWise không cung cấp tư vấn đầu tư.',

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); },

  _money(n) {
    if (typeof window.money === 'function') return window.money(n);
    return Number(n).toLocaleString('vi-VN') + ' đ';
  },

  /* =========================================================
     AI-1: EXPENSE CATEGORIZER
     ========================================================= */
  CATEGORY_RULES: [
    {
      keywords: ['cafe','coffee','highlands','starbuck','trà sữa','quán','food','ăn','nhà hàng','phở','cơm','bún'],
      cat: 'Ăn uống',
      confidence: 0.94,
      reason: 'Từ khoá trong mô tả khớp với nhóm chi tiêu ăn uống và lịch sử giao dịch tương tự.'
    },
    {
      keywords: ['grab','taxi','xe','xăng','bus','di chuyển','vé','be','xe buýt','đi'],
      cat: 'Di chuyển',
      confidence: 0.91,
      reason: 'Mô tả khớp với nhóm dịch vụ di chuyển / phương tiện công cộng.'
    },
    {
      keywords: ['sách','shopee','lazada','mua','siêu thị','fahasa','tiki','quần áo'],
      cat: 'Mua sắm',
      confidence: 0.88,
      reason: 'Từ khoá liên quan đến mua sắm, thương mại điện tử.'
    },
    {
      keywords: ['phim','game','netflix','giải trí','spotify','youtube','cgv','xem'],
      cat: 'Giải trí',
      confidence: 0.86,
      reason: 'Mô tả thuộc nhóm dịch vụ giải trí / đăng ký định kỳ.'
    },
    {
      keywords: ['điện','nước','internet','hoá đơn','hóa đơn','wifi','điện thoại'],
      cat: 'Hoá đơn',
      confidence: 0.90,
      reason: 'Từ khoá liên quan đến hoá đơn định kỳ hàng tháng.'
    },
    {
      keywords: ['lương','thưởng','income','thu nhập','freelance','hoa hồng'],
      cat: 'Thu nhập',
      confidence: 0.95,
      reason: 'Mô tả thuộc nhóm thu nhập.'
    }
  ],

  async categorize(desc) {
    await this._delay(600);

    if (!desc || !desc.trim()) {
      return {
        success: false,
        error: 'Vui lòng nhập mô tả giao dịch (ví dụ: "Phúc Long 96.000đ") trước khi phân loại.',
        // backward compat
        cat: 'Khác', confidence: 0, reason: '', uncertain: true
      };
    }

    const lower = desc.toLowerCase().trim();
    const matched = this.CATEGORY_RULES.find(r =>
      r.keywords.some(kw => lower.includes(kw))
    );

    // Fallback rule 
    if (!matched) {
      return {
        success: true,
        data: {
          cat: 'Khác',
          confidence: '55%',
          reason: 'AI chưa chắc chắn – mô tả chưa đủ đặc trưng để phân loại chính xác.',
          disclaimer: this.DISCLAIMER
        },
        // backward compat
        cat: 'Khác',
        confidence: 0.55,
        reason: 'AI chưa chắc chắn – mô tả chưa đủ đặc trưng để phân loại chính xác.',
        uncertain: true
      };
    }

    return {
      success: true,
      data: {
        cat: matched.cat,
        confidence: Math.round(matched.confidence * 100) + '%',
        reason: matched.reason,
        disclaimer: this.DISCLAIMER
      },
      // backward compat
      cat: matched.cat,
      confidence: matched.confidence,
      reason: matched.reason,
      uncertain: false
    };
  },

  /* =========================================================
     AI-2: SPENDING PATTERN INSIGHT
     ========================================================= */
  async patternInsight(rows) {
    await this._delay(900);

    if (!rows || rows.length < 3) {
      return {
        success: false,
        error: 'Không đủ dữ liệu để đưa ra đề xuất. Cần ít nhất 3 giao dịch trong 30 ngày.',
        // backward compat
        insufficient: true,
        message: 'Không đủ dữ liệu để đưa ra đề xuất.'
      };
    }

    const total = rows.reduce((s, r) => s + (r.amount < 0 ? -r.amount : 0), 0);
    const byCat = {};
    rows.filter(r => r.amount < 0).forEach(r => {
      byCat[r.category] = (byCat[r.category] || 0) + (-r.amount);
    });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

    const anomalies = rows
      .filter(r => r.amount < -500000)
      .slice(0, 2)
      .map(r => ({
        label: r.desc + ' – ' + r.date,
        amount: r.amount
      }));

    const confidence = rows.length >= 10 ? '92%'
                     : rows.length >= 5  ? '78%'
                     : '65%';

    const summary = 'Tổng chi tháng này là ' + this._money(total) +
      '. Danh mục chi nhiều nhất: "' + (top ? top[0] : '—') + '".';
    const reason  = 'Phân tích dựa trên ' + rows.length + ' giao dịch trong 30 ngày gần nhất.';

    return {
      success: true,
      data: {
        summary,
        reason,
        confidence,
        disclaimer: this.DISCLAIMER,
        totalSpent: total,
        topCategory: top ? top[0] : null,
        sampleSize: rows.length,
        anomalies
      },
      // backward compat
      summary,
      reason,
      anomalies
    };
  },

  /* =========================================================
     AI-3: GOAL COACH
     ========================================================= */
  async goalCoach(name, amount, deadline) {
    await this._delay(1000);

    if (!amount || amount <= 0) {
      return {
        success: false,
        error: 'Không đủ dữ liệu – vui lòng nhập số tiền mục tiêu lớn hơn 0.',
        insufficient: true,
        message: 'Không đủ dữ liệu – vui lòng nhập số tiền mục tiêu lớn hơn 0.'
      };
    }
    if (!deadline) {
      return {
        success: false,
        error: 'Không đủ dữ liệu – vui lòng chọn thời hạn cho mục tiêu.',
        insufficient: true,
        message: 'Không đủ dữ liệu – vui lòng chọn thời hạn cho mục tiêu.'
      };
    }

    const months = Math.max(1,
      Math.round((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)));

    if (months <= 0) {
      return {
        success: false,
        error: 'Thời hạn đã ở quá khứ. Vui lòng chọn ngày trong tương lai.',
        insufficient: true,
        message: 'Thời hạn đã ở quá khứ. Vui lòng chọn ngày trong tương lai.'
      };
    }

    const perMonth = Math.round(amount / months);
    const confidence = perMonth > 0 ? '88%' : '60%';

    const steps = [
      'Giảm ~' + this._money(Math.round(perMonth * 0.15)) + ' chi tiêu không thiết yếu mỗi tháng.',
      'Tự động trích ' + this._money(perMonth) + ' vào quỹ "' + name + '" ngay khi nhận lương.',
      'Rà soát tiến độ và điều chỉnh ngân sách sau mỗi 2 tuần.'
    ];
    const reason = 'Dựa trên mục tiêu ' + this._money(amount) + ' trong ' + months +
      ' tháng → cần tiết kiệm khoảng ' + this._money(perMonth) + '/tháng.';

    return {
      success: true,
      data: {
        steps,
        reason,
        confidence,
        disclaimer: this.DISCLAIMER,
        months,
        perMonth
      },
      // backward compat
      steps,
      reason
    };
  }
};

window.AI = AI;