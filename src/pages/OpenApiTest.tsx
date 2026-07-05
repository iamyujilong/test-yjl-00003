import { useState } from 'react'
import { Send, CheckCircle, XCircle, Copy, FileCode } from 'lucide-react'

export function OpenApiTest() {
  const [apiKey, setApiKey] = useState('')
  const [endpoint, setEndpoint] = useState('/api/open/test')
  const [method, setMethod] = useState('POST')
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    platform: 'test',
    user_id: '123456',
    phone: '13800138000',
    car_interest: '宝马3系',
    source: 'advertisement'
  }, null, 2))
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setSuccess(null)
    try {
      const res = await fetch(`${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey || 'test-api-key'
        },
        body: method === 'POST' ? requestBody : undefined
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setSuccess(res.ok)
    } catch (error) {
      setResponse(JSON.stringify({ error: (error as Error).message }, null, 2))
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">开放 API 测试</h1>
        <p className="text-gray-500 mt-1">测试广告平台对接 API 是否正常</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入 API Key，默认使用 test-api-key"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">请求方法</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API 端点</label>
              <select
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="/api/open/test">/api/open/test - 连通性测试</option>
                <option value="/api/open/lead">/api/open/lead - 客户线索推送</option>
                <option value="/api/open/convert">/api/open/convert - 转化跟踪</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">请求体 (JSON)</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono"
            />
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {loading ? '测试中...' : '发送测试请求'}
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              响应结果
            </h3>
            {response && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Copy className="w-4 h-4" />
                复制
              </button>
            )}
          </div>

          {success !== null && (
            <div className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg ${
              success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {success ? (
                <><CheckCircle className="w-5 h-5" /> 请求成功</>
              ) : (
                <><XCircle className="w-5 h-5" /> 请求失败</>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
            {response ? (
              <pre className="text-sm font-mono text-gray-600 whitespace-pre-wrap">{response}</pre>
            ) : (
              <p className="text-gray-400 text-center py-12">点击上方按钮发送测试请求</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">API 文档</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">POST</span>
              <span className="font-medium text-gray-900">/api/open/test</span>
            </div>
            <p className="text-sm text-gray-600">连通性测试接口，验证 API 是否正常工作</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">POST</span>
              <span className="font-medium text-gray-900">/api/open/lead</span>
            </div>
            <p className="text-sm text-gray-600">客户线索推送接口，广告平台推送兴趣用户数据</p>
            <pre className="text-xs font-mono text-gray-500 mt-2 bg-gray-50 p-2 rounded">
{`请求参数:
{
  "platform": "广告平台名称",
  "user_id": "用户ID",
  "phone": "手机号",
  "car_interest": "感兴趣车型",
  "source": "来源渠道"
}`}
            </pre>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">GET</span>
              <span className="font-medium text-gray-900">/api/open/convert</span>
            </div>
            <p className="text-sm text-gray-600">转化跟踪接口，查询客户线索转化状态</p>
            <pre className="text-xs font-mono text-gray-500 mt-2 bg-gray-50 p-2 rounded">
{`查询参数:
?user_id=用户ID&platform=广告平台名称`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
