# CRL-CdM System™ — GitHub Pages

## 发布

1. 将本目录内的 `index.html`、`assets/`、`.nojekyll` 上传到 GitHub Repository 根目录。不要只上传 index.html，也不要把外层 github-pages 文件夹作为仓库根目录下的子目录上传。
2. 打开仓库 Settings → Pages。
3. Source 选择 Deploy from a branch，Branch 选择 main，目录选择 / (root)，保存。
4. 等待 GitHub 显示发布地址。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

无需安装依赖、构建或外部 CDN。资源引用均为相对路径，兼容 GitHub Pages 的仓库子路径。

## 内容与检查

- 来源：v0.4.5，30 秒触发警告，20 秒后消失。
- 17 张 PNG（16 个页面状态及警告图）、1 个 SVG 图标，提取后每个文件的 SHA-256 与原始内嵌字节一致。
- 1 个独立 CSS、1 个独立 JS；没有内嵌字体。fonts 目录预留，可为空。
- index.html：1,281 字节；原 HTML：77,457,284 字节。
- 运行资源合计：58,095,215 字节（不含本文）。
- CSS、JS 回填重建比对通过：除了资源地址，源文档与拆分后文档一致。
- 所有提取资源及 HTML 引用存在；JavaScript 语法检查通过。
- 保留原页面的现代浏览器 API，适用于当前 Chrome/Edge；未进行实际浏览器逐帧视觉比对或 GitHub 在线部署验证。

保持原有地图切换、Clear/详情、侧栏、主题、热区、页面缩放、标题与通知计时逻辑。
