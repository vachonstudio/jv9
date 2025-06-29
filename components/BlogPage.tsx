import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Rss, UserPlus, Star, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { BlogPostCard } from "./BlogPostCard";
import { ProtectedContent } from "./ProtectedContent";
import { 
  blogPosts, 
  blogCategories, 
  BlogPost, 
  getFeaturedPosts,
  getPublicPosts,
  getPrivatePosts,
  getPostsByCategory 
} from "../types/blog";

interface BlogPageProps {
  isAuthenticated: boolean;
  onSignupClick: () => void;
  onPostClick: (post: BlogPost) => void;
}

export function BlogPage({ isAuthenticated, onSignupClick, onPostClick }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let posts = getPostsByCategory(selectedCategory);
    
    // Filter by search query
    if (searchQuery.trim()) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredPosts(posts);
    setDisplayedPosts(posts);
  }, [selectedCategory, searchQuery]);

  const handlePostClick = (post: BlogPost) => {
    console.log('Blog post clicked:', post.title); // Debug logging
    if (post.visibility === 'private' && !isAuthenticated) {
      onSignupClick();
    } else {
      onPostClick(post);
    }
  };

  const featuredPosts = getFeaturedPosts();
  const publicPostsCount = getPublicPosts().length;
  const subscriberPostsCount = getPrivatePosts().length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">Stories & Insights</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dive deep into UX design, user research, and product strategy with 
              real-world case studies and actionable insights.
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button 
                onClick={() => setSelectedCategory("All")}
                size="lg"
              >
                <Rss className="w-4 h-4 mr-2" />
                Browse All Stories
              </Button>
              {!isAuthenticated && (
                <Button 
                  variant="outline"
                  onClick={onSignupClick}
                  size="lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Subscribe for Premium Content
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold mb-2">{publicPostsCount}</div>
                <div className="text-muted-foreground">Free Articles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold mb-2">{subscriberPostsCount}</div>
                <div className="text-muted-foreground">Premium Articles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold mb-2">2.5k+</div>
                <div className="text-muted-foreground">Monthly Readers</div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2>Featured Stories</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    Editor's Choice
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCategory("All")}
                >
                  View All
                </Button>
              </div>
              
              {/* Featured Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.slice(0, 3).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <div className="relative">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <Badge className="bg-primary/90 text-primary-foreground">
                            {post.category}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-yellow-500/90 text-yellow-900 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <h3 className="mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{post.readTime}</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Premium Content CTA for non-authenticated users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 mb-12 text-center"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="mb-3">Unlock Premium UX Content</h3>
                <p className="text-muted-foreground mb-6">
                  Get access to in-depth case studies, advanced techniques, and exclusive 
                  resources from industry experts. Join our community of UX professionals.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={onSignupClick} size="lg">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Join Free - Unlock Premium Content
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
                  <span>✓ 30+ Premium Articles</span>
                  <span>✓ Exclusive Resources</span>
                  <span>✓ Monthly Newsletters</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blogCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2>
                {selectedCategory === "All" ? "All Stories" : `${selectedCategory} Articles`}
              </h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <AnimatePresence>
            {displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post, index) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                    index={index}
                    showProtected={!isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No articles found matching your criteria.</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-4"
                  >
                    Clear filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Newsletter Signup for bottom of page */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 text-center"
            >
              <Card className="bg-accent/30">
                <CardContent className="p-8">
                  <h3 className="mb-3">Never Miss a Story</h3>
                  <p className="text-muted-foreground mb-6">
                    Join our community to get the latest UX insights delivered to your inbox.
                  </p>
                  <Button onClick={onSignupClick} size="lg">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}