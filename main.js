// Supabase 配置
const supabaseUrl = 'https://vuepxfqrrawsqqbvthyw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1ZXB4ZnFycmF3c3FxYnZ0aHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwOTYyNTMsImV4cCI6MjA3ODY3MjI1M30.AvOGDNppTOPge9SOJdb1CZgx816ntIGGuTUIH7-s2KE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 加载最新文章
async function loadRecentPosts() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            *,
            categories(name),
            post_tags(
                tags(name)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
    console.error('Error loading posts:', error);
    return;
    }

    const postsContainer = document.getElementById('recent-posts');
    
    if (posts && posts.length > 0) {
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
        <h4>${post.title}</h4>
        <div class="post-meta">
            <span>分类: ${post.categories.name}</span>
            <span>发布时间: ${new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <p>${post.content.substring(0, 100)}...</p>
        <div class="tags">
            ${post.post_tags.map(pt => `<span class="tag">${pt.tags.name}</span>`).join('')}
        </div>
        </div>
    `).join('');
    } else {
    postsContainer.innerHTML = '<p>暂无文章</p>';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadRecentPosts();
});