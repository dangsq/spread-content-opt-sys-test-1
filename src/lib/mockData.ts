function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function now() {
  return new Date().toISOString();
}

/* ─── Users ─── */
interface User {
  id: string; username: string; password: string; created_at: string;
}
const users: Record<string, User> = {};

/* ─── Personas ─── */
interface Persona {
  id: string; user_id: string; title: string; description: string;
  platforms: string[]; status: string; result: any; created_at: string; updated_at: string;
}
const personas: Record<string, Persona> = {};

/* ─── Optimizations ─── */
interface Optimization {
  id: string; user_id: string; persona_id: string; persona_title: string; original_content: string;
  optimized_content: string | null; image_urls: string[]; generated_image: string | null;
  status: string; created_at: string; updated_at: string;
}
const optimizations: Record<string, Optimization> = {};

/* ─── Seed templates ─── */
function seedTemplates() {
  const templates = [
    { title: "一线城市职场女性", description: "25-35岁，生活在一二线城市，本科以上学历，从事白领/管理岗位，月收入15k-40k，关注职场发展、生活方式、消费升级", platforms: ["小红书"], demo: "职场" },
    { title: "Z世代大学生", description: "18-23岁，在校大学生，生活费用1.5k-3k/月，活跃于社交平台，关注潮流、娱乐、社交、性价比消费", platforms: ["抖音"], demo: "年轻" },
    { title: "新中产家庭决策者", description: "30-45岁，已婚有孩，家庭年收入50w-150w，关注教育、健康、投资、品质生活，消费决策理性", platforms: ["知乎"], demo: "中产" },
    { title: "数字游民/自由职业者", description: "22-38岁，远程工作或自由职业，追求工作生活平衡，关注效率工具、被动收入、旅居生活", platforms: ["B站"], demo: "自由" },
    { title: "银发族养生人群", description: "55-70岁，退休或半退休，关注健康养生、孙辈教育、社区活动，消费理性但对健康投入不设限", platforms: ["微信公众号"], demo: "银发" },
    { title: "二次元圈层用户", description: "16-28岁，深度ACG爱好者，活跃于特定社区，愿意为周边/手办付费，对IP忠诚度高", platforms: ["B站"], demo: "二次元" },
    { title: "母婴育儿妈妈群", description: "25-38岁，新手妈妈或二胎妈妈，关注育儿知识、母婴好物、早教启蒙，种草转化率高", platforms: ["小红书"], demo: "母婴" },
    { title: "科技极客/数码控", description: "20-40岁，科技产品爱好者，关注数码评测、黑科技、开源社区，决策理性但为兴趣买单", platforms: ["知乎"], demo: "科技" },
  ];
  for (const t of templates) {
    const id = uid("tpl");
    const r = generatePersonaResult(t.title, t.description, t.platforms, t.demo);
    personas[id] = { id, user_id: "__template__", title: t.title, description: t.description, platforms: t.platforms, status: "completed", result: r, created_at: now(), updated_at: now() };
  }
}
seedTemplates();

function generatePersonaResult(title: string, description: string, platforms: string[], variant: string) {
  const keyw = ["生活方式", "消费", "品质", "效率"];
  if (variant === "职场") keyw.push("职场穿搭", "办公室好物", "副业增收", "女性成长");
  if (variant === "年轻") keyw.push("平价好物", "宿舍改造", "潮流穿搭", "社交");
  if (variant === "中产") keyw.push("子女教育", "家庭理财", "健康管理", "房产");
  if (variant === "自由") keyw.push("效率工具", "旅居生活", "被动收入", "远程办公");
  if (variant === "银发") keyw.push("健康养生", "广场舞", "孙辈教育", "社区活动");
  if (variant === "二次元") keyw.push("ACG", "手办模型", "Cosplay", "漫展");
  if (variant === "母婴") keyw.push("育儿知识", "早教启蒙", "母婴好物", "辅食");
  if (variant === "科技") keyw.push("科技数码", "黑科技", "开源社区", "AI");

  const preferences: Record<string, any> = {
    "内容形式": variant === "二次元" ? ["短视频", "直播", "图文"] : variant === "科技" ? ["深度文章", "视频评测", "播客"] : ["图文", "短视频", "深度文章"],
    "语气风格": variant === "职场" ? "专业但有温度" : variant === "年轻" || variant === "二次元" ? "轻松活泼" : variant === "科技" ? "理性专业" : "真诚温暖",
    "阅读时长": variant === "银发" ? "2-3分钟" : variant === "科技" ? "5-10分钟" : "3-5分钟",
  };

  const painMap: Record<string, string[]> = {
    "职场": ["信息过载，需要高效获取有价值内容", "缺乏个性化推荐，内容同质化严重", "职场晋升瓶颈，缺乏清晰的成长路径"],
    "年轻": ["生活费有限，想要好物但预算紧张", "娱乐内容过多，缺乏深度", "对未来迷茫，需要规划指导"],
    "中产": ["子女教育焦虑，升学路径不清晰", "家庭资产配置困难", "时间碎片化，深度阅读稀缺"],
    "自由": ["收入不稳定，缺乏安全感", "社交孤立，缺少线下交流", "自律困难，时间管理挑战大"],
    "银发": ["健康信息繁杂难辨真假", "与年轻世代存在数字鸿沟", "退休生活空虚，需要社交归属"],
    "二次元": ["圈外人难以理解，社交区隔明显", "周边产品价格虚高", "优质中文内容稀缺"],
    "母婴": ["育儿信息碎片化可信度低", "产后恢复与职业平衡难", "母婴产品选择焦虑"],
    "科技": ["新品迭代快选择困难", "参数党与实际体验脱节", "硬核内容门槛过高"],
  };
  const pain = painMap[variant] || painMap["自由"];

  return {
    raw_data: {
      platforms_scraped: platforms,
      total_posts: Math.floor(Math.random() * 400) + 100,
      sample_keywords: keyw.slice(0, 8),
      demographic_hints: {
        age_range: variant === "银发" ? "55-70" : variant === "年轻" || variant === "二次元" ? "16-28" : "25-45",
        gender_distribution: variant === "母婴" ? { male: 0.1, female: 0.9 } : variant === "科技" ? { male: 0.8, female: 0.2 } : variant === "银发" ? { male: 0.4, female: 0.6 } : { male: 0.3, female: 0.7 },
        city_tier: "一二线城市",
        income_level: variant === "年轻" ? "中低收入" : variant === "银发" ? "退休收入" : variant === "中产" ? "高收入" : "中高收入",
      },
    },
    analysis: {
      basic_profile: {
        "年龄范围": variant === "银发" ? "55-70岁" : variant === "年轻" || variant === "二次元" ? "16-28岁" : "25-45岁",
        "性别": variant === "母婴" ? "女性为主" : variant === "科技" ? "男性偏多" : "女性偏多",
        "城市分布": "一二线城市",
        "收入水平": variant === "年轻" ? "1.5k-3k/月" : variant === "银发" ? "退休金" : variant === "中产" ? "50w-150w/年" : "15k-40k/月",
      },
      interest_tags: keyw.slice(0, 8),
      content_preferences: preferences,
      pain_points: pain,
      communication_strategy: {
        "核心切入角度": "从用户痛点切入，提供解决方案型内容",
        "推荐内容形式": "list-style图文 + 短视频组合",
        "行动号召": "强调限时/稀缺性，配合社交分享激励",
      },
    },
  };
}

function mockOptimizeContent(persona: Persona, content: string): string {
  const analysis = persona.result?.analysis || {};
  const prefs = analysis.content_preferences || {};
  const strat = analysis.communication_strategy || {};
  const tone = prefs["语气风格"] || "专业";
  const angle = strat["核心切入角度"] || "直接切入";
  const cta = strat["行动号召"] || "无";

  return (
    `【针对目标人群优化 - ${tone}风格】\n\n` +
    `🎯 切入角度：${angle}\n\n` +
    `${content}\n\n` +
    `📌 优化要点：\n` +
    `• 语气调整为「${tone}」\n` +
    `• 增加与目标人群共鸣的案例\n` +
    `• 简化长句，突出重点信息\n` +
    `• 视觉建议：配合信息图表呈现\n\n` +
    `🔥 行动号召：${cta}\n\n` +
    `---\n` +
    `💡 备选标题建议：\n` +
    `1. 标题A（痛点导向）\n` +
    `2. 标题B（利益导向）\n` +
    `3. 标题C（好奇心导向）`
  );
}

/* ─── Mock API implementations ─── */

const mockToken = "mock_jwt_token_" + Date.now();

export const mockAuth = {
  register(username: string, _password: string) {
    const id = uid("usr");
    users[username] = { id, username, password: _password, created_at: now() };
    return { access_token: mockToken, token_type: "bearer", username };
  },
  login(username: string, _password: string) {
    const u = users[username];
    if (!u) {
      const id = uid("usr");
      users[username] = { id, username, password: _password, created_at: now() };
    }
    return { access_token: mockToken, token_type: "bearer", username };
  },
  me() {
    let first = Object.values(users)[0];
    if (!first) {
      const id = uid("usr");
      users["default"] = { id, username: "default", password: "pass", created_at: now() };
      first = users["default"];
    }
    return { id: first.id, username: first.username };
  },
};

export const mockPersona = {
  list() {
    const tpls = Object.values(personas).filter((p) => p.user_id === "__template__");
    const user = Object.values(personas).filter((p) => p.user_id !== "__template__");
    return [...tpls, ...user];
  },
  get(id: string) {
    const p = personas[id];
    if (!p) throw new Error("not found");
    return p;
  },
  create(data: { title: string; description: string; platform: string }) {
    const id = uid("per");
    const nowStr = now();
    const record: Persona = {
      id, user_id: "local_user", title: data.title, description: data.description,
      platforms: [data.platform], status: "analyzing", result: null, created_at: nowStr, updated_at: nowStr,
    };
    personas[id] = record;
    const result = generatePersonaResult(data.title, data.description, [data.platform], "custom");
    record.result = result;
    record.status = "completed";
    record.updated_at = now();
    return record;
  },
  delete(id: string) {
    const p = personas[id];
    if (!p || p.user_id === "__template__") throw new Error("cannot delete");
    delete personas[id];
    return null;
  },
};

export const mockOptimize = {
  list() {
    return Object.values(optimizations);
  },
  get(id: string) {
    const o = optimizations[id];
    if (!o) throw new Error("not found");
    return o;
  },
  create(data: { persona_id: string; original_content: string; image_urls?: string[] }) {
    const persona = personas[data.persona_id];
    if (!persona) throw new Error("persona not found");
    const id = uid("opt");
    const nowStr = now();
    const record: Optimization = {
      id, user_id: "local_user", persona_id: data.persona_id, persona_title: persona.title,
      original_content: data.original_content, optimized_content: null,
      image_urls: data.image_urls || [], generated_image: null,
      status: "processing", created_at: nowStr, updated_at: nowStr,
    };
    optimizations[id] = record;
    record.optimized_content = mockOptimizeContent(persona, data.original_content);
    record.status = "completed";
    record.updated_at = now();
    return record;
  },
  generateImage(id: string) {
    const o = optimizations[id];
    if (!o) throw new Error("not found");
    o.generated_image = `https://picsum.photos/seed/${uid("img")}/800/600`;
    o.updated_at = now();
    return o;
  },
};
