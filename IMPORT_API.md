# 📥 师傅的购物单词本 - 词库导入 API 文档

本接口用于向本地 SQLite 数据库批量导入单词。支持自动查重，不会覆盖已有的学习进度。

## 1. 基础信息
*   **端点 (URL)**: `http://localhost:3000/api/import`
*   **方法 (Method)**: `POST`
*   **内容类型 (Content-Type)**: `application/json`

## 2. 请求格式 (Request Body)
请求体必须是一个 **JSON 数组**。

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `japanese` | `string` | **是** | 单词原文（唯一标识，重复则跳过） |
| `kana` | `string` | 否 | 假名读音 |
| `chinese` | `string` | 否 | 中文释义 |
| `english` | `string` | 否 | 英文释义 |
| `source` | `string` | 否 | 来源标签 |

### 请求示例
```json
[
  {
    "japanese": "便利",
    "kana": "べんり",
    "chinese": "方便",
    "english": "Convenient",
    "source": "FamilyMart"
  }
]
```

## 3. 响应格式 (Response)

### 成功 (200 OK)
```json
{
  "success": true,
  "message": "Import completed",
  "imported": 1, 
  "skipped": 0
}
```
*   `imported`: 成功写入的新单词数量。
*   `skipped`: 因重复或格式错误跳过的数量。

### 错误 (400/405/500)
*   `400`: 数据格式非数组。
*   `405`: 使用了非 POST 方法。
*   `500`: 数据库写入失败。

## 4. 自动化调用示例 (curl)
```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '[{"japanese":"テスト","chinese":"测试"}]'
```
