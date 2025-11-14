// Supabase 配置
const supabaseUrl = 'https://vuepxfqrrawsqqbvthyw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1ZXB4ZnFycmF3c3FxYnZ0aHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwOTYyNTMsImV4cCI6MjA3ODY3MjI1M30.AvOGDNppTOPge9SOJdb1CZgx816ntIGGuTUIH7-s2KE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 加载所有文章
async function loadAllPosts(categoryFilter = '', tagFilter = '') {
    let query = supabase
        .from('posts')
        .select(`
            *,
            categories(name),
            post_tags(
                tags(name)
            )
        `)
        .order('created_at', { ascending: false });

    if (categoryFilter) {
        query = query.eq('categories.name', categoryFilter);
    }

    const { data: posts, error } = await query;

    if (error) {
        console.error('Error loading posts:', error);
        return;
    }

    // 如果有标签筛选，在客户端进行筛选
    let filteredPosts = posts;
    if (tagFilter) {
        filteredPosts = posts.filter(post => 
            post.post_tags.some(pt => pt.tags.name === tagFilter)
        );
    }

    const postsContainer = document.getElementById('posts-container');
    
    if (filteredPosts && filteredPosts.length > 0) {
        postsContainer.innerHTML = filteredPosts.map(post => `
            <div class="post-card">
                <h4>${post.title}</h4>
                <div class="post-meta">
                    <span>分类: ${post.categories.name}</span>
                    <span>发布时间: ${new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <p>${post.content.substring(0, 200)}...</p>
                <div class="tags">
                    ${post.post_tags.map(pt => `<span class="tag">${pt.tags.name}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } else {
        postsContainer.innerHTML = '<p>暂无文章</p>';
    }
}

// 加载分类和标签选项
async function loadFilters() {
    // 加载分类
    const { data: categories } = await supabase
        .from('categories')
        .select('name')
        .order('name');

    const categorySelect = document.getElementById('category-filter');
    if (categories) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // 加载标签
    const { data: tags } = await supabase
        .from('tags')
        .select('name')
        .order('name');

    const tagSelect = document.getElementById('tag-filter');
    if (tags) {
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.name;
            option.textContent = tag.name;
            tagSelect.appendChild(option);
        });
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadAllPosts();
    loadFilters();

    // 添加筛选事件监听
    document.getElementById('category-filter').addEventListener('change', function() {
        const category = this.value;
        const tag = document.getElementById('tag-filter').value;
        loadAllPosts(category, tag);
    });

    document.getElementById('tag-filter').addEventListener('change', function() {
        const tag = this.value;
        const category = document.getElementById('category-filter').value;
        loadAllPosts(category, tag);
    });
});