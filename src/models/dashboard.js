import { get } from '@/lin/plugins/axios'

class Dashboard {
  async getMarketMetrics() {
    return get('cms/market_metrics')
  }
}

export default new Dashboard()
