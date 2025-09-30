-- Insert initial skills taxonomy
INSERT INTO skills (name, category, description) VALUES
-- Technology
('JavaScript', 'Technology', 'Programming language for web development'),
('Python', 'Technology', 'Versatile programming language'),
('React', 'Technology', 'JavaScript library for building user interfaces'),
('Node.js', 'Technology', 'JavaScript runtime for server-side development'),
('SQL', 'Technology', 'Database query language'),
('Machine Learning', 'Technology', 'AI and data science techniques'),
('Web Development', 'Technology', 'Building websites and web applications'),
('Mobile Development', 'Technology', 'Creating mobile applications'),
('DevOps', 'Technology', 'Development and operations practices'),
('Cybersecurity', 'Technology', 'Information security practices'),

-- Design
('UI/UX Design', 'Design', 'User interface and experience design'),
('Graphic Design', 'Design', 'Visual communication design'),
('Web Design', 'Design', 'Designing websites and digital interfaces'),
('Branding', 'Design', 'Creating brand identity and strategy'),
('Illustration', 'Design', 'Creating visual artwork and illustrations'),

-- Business
('Marketing', 'Business', 'Promoting products and services'),
('Sales', 'Business', 'Selling products and services'),
('Project Management', 'Business', 'Planning and executing projects'),
('Leadership', 'Business', 'Leading teams and organizations'),
('Entrepreneurship', 'Business', 'Starting and running businesses'),
('Finance', 'Business', 'Financial planning and management'),
('Strategy', 'Business', 'Business planning and strategy'),

-- Creative
('Writing', 'Creative', 'Content creation and copywriting'),
('Photography', 'Creative', 'Taking and editing photographs'),
('Video Production', 'Creative', 'Creating and editing videos'),
('Music Production', 'Creative', 'Creating and producing music'),
('Animation', 'Creative', 'Creating animated content'),

-- Trades
('Carpentry', 'Trades', 'Woodworking and construction'),
('Plumbing', 'Trades', 'Water systems installation and repair'),
('Electrical', 'Trades', 'Electrical systems and wiring'),
('Welding', 'Trades', 'Joining metals through welding'),
('Automotive', 'Trades', 'Vehicle maintenance and repair'),

-- Health & Wellness
('Fitness Training', 'Health', 'Physical fitness and exercise'),
('Nutrition', 'Health', 'Diet and nutritional guidance'),
('Mental Health', 'Health', 'Psychological wellbeing support'),
('Yoga', 'Health', 'Yoga practice and instruction'),
('Meditation', 'Health', 'Mindfulness and meditation techniques');

-- Insert topic rooms
INSERT INTO topic_rooms (name, description, category, is_public, created_by) VALUES
('Tech Talk', 'General technology discussions and Q&A', 'Technology', true, null),
('Web Development', 'Frontend, backend, and full-stack development', 'Technology', true, null),
('Design Studio', 'UI/UX, graphic design, and creative discussions', 'Design', true, null),
('Business Strategy', 'Entrepreneurship, marketing, and business growth', 'Business', true, null),
('Creative Corner', 'Writing, photography, video, and creative arts', 'Creative', true, null),
('Skilled Trades', 'Carpentry, plumbing, electrical, and trade skills', 'Trades', true, null);

-- Insert badges
INSERT INTO badges (name, description, icon_url, criteria) VALUES
('Helper', 'Answered 5 questions', '/badges/helper.svg', '{"type": "answer_count", "threshold": 5}'),
('Mentor', 'Helped 10 different learners', '/badges/mentor.svg', '{"type": "unique_help_count", "threshold": 10}'),
('Teacher', 'Created 3 lessons or tutorials', '/badges/teacher.svg', '{"type": "content_created", "threshold": 3}'),
('Expert', 'Received 50 upvotes on answers', '/badges/expert.svg', '{"type": "upvotes_received", "threshold": 50}'),
('Consistent', 'Maintained a 7-day streak', '/badges/consistent.svg', '{"type": "streak", "threshold": 7}'),
('Popular', 'Got 100 followers', '/badges/popular.svg', '{"type": "followers", "threshold": 100}'),
('Contributor', 'Made 25 posts in topic rooms', '/badges/contributor.svg', '{"type": "posts_count", "threshold": 25}'),
('Learner', 'Completed 5 lessons', '/badges/learner.svg', '{"type": "lessons_completed", "threshold": 5}'),
('Scholar', 'Completed 10 tutorials', '/badges/scholar.svg', '{"type": "tutorials_completed", "threshold": 10}'),
('Community Builder', 'Created a topic room with 50+ members', '/badges/community.svg', '{"type": "room_members", "threshold": 50}');

-- Create demo user profiles (these will be created when users sign up)
-- The actual user creation happens through Supabase Auth

-- Insert sample lessons
INSERT INTO lessons (title, description, content, duration_minutes, skill_level, tags, author_id, is_published) VALUES
('Introduction to JavaScript', 'Learn the basics of JavaScript programming', 
'{"steps": [{"title": "Variables and Data Types", "content": "Learn about var, let, const and different data types", "media": null}, {"title": "Functions", "content": "Understanding function declarations and expressions", "media": null}, {"title": "Control Flow", "content": "If statements, loops, and conditional logic", "media": null}]}', 
45, 'beginner', ARRAY['JavaScript', 'Programming', 'Web Development'], null, true),

('React Fundamentals', 'Build your first React application', 
'{"steps": [{"title": "Components", "content": "Creating functional and class components", "media": null}, {"title": "Props and State", "content": "Managing component data and communication", "media": null}, {"title": "Event Handling", "content": "Handling user interactions", "media": null}]}', 
60, 'intermediate', ARRAY['React', 'JavaScript', 'Frontend'], null, true),

('UI/UX Design Principles', 'Learn fundamental design principles', 
'{"steps": [{"title": "Design Thinking", "content": "Understanding user-centered design", "media": null}, {"title": "Visual Hierarchy", "content": "Organizing information effectively", "media": null}, {"title": "Color Theory", "content": "Using colors to enhance user experience", "media": null}]}', 
40, 'beginner', ARRAY['UI/UX Design', 'Design', 'Visual Design'], null, true),

('Python for Beginners', 'Start your Python programming journey', 
'{"steps": [{"title": "Syntax Basics", "content": "Python syntax and indentation", "media": null}, {"title": "Data Structures", "content": "Lists, dictionaries, and tuples", "media": null}, {"title": "Loops and Conditions", "content": "Control flow in Python", "media": null}]}', 
50, 'beginner', ARRAY['Python', 'Programming', 'Backend'], null, true),

('Digital Marketing Basics', 'Learn essential digital marketing strategies', 
'{"steps": [{"title": "SEO Fundamentals", "content": "Search engine optimization basics", "media": null}, {"title": "Social Media Marketing", "content": "Leveraging social platforms", "media": null}, {"title": "Content Strategy", "content": "Creating engaging content", "media": null}]}', 
35, 'beginner', ARRAY['Marketing', 'Digital Marketing', 'Business'], null, true);

-- Insert sample questions
INSERT INTO questions (title, content, tags, author_id) VALUES
('How do I center a div in CSS?', 'I''ve been struggling with centering a div element both horizontally and vertically. What are the best modern approaches?', ARRAY['CSS', 'Web Development', 'Frontend'], null),
('What''s the difference between let and var in JavaScript?', 'I keep seeing both let and var used for variable declarations. When should I use each one?', ARRAY['JavaScript', 'Programming', 'Variables'], null),
('How to choose the right color palette for a website?', 'I''m designing my first website and struggling with color choices. Any tips for creating a cohesive color scheme?', ARRAY['Design', 'UI/UX', 'Color Theory'], null),
('Best practices for API design?', 'I''m building my first REST API. What are some important principles I should follow?', ARRAY['API', 'Backend', 'Best Practices'], null),
('How to get started with machine learning?', 'I have a programming background but I''m new to ML. What''s the best learning path?', ARRAY['Machine Learning', 'Python', 'Data Science'], null);

-- Insert sample resources
INSERT INTO resources (title, description, type, url, tags, skill_level, author_id) VALUES
('JavaScript Cheat Sheet', 'Quick reference for JavaScript syntax and methods', 'pdf', '/resources/js-cheat-sheet.pdf', ARRAY['JavaScript', 'Reference'], 'beginner', null),
('React Component Library', 'Collection of reusable React components', 'link', 'https://github.com/example/react-components', ARRAY['React', 'Components', 'Library'], 'intermediate', null),
('Design System Template', 'Figma template for creating design systems', 'link', 'https://figma.com/design-system-template', ARRAY['Design System', 'Figma', 'UI/UX'], 'intermediate', null),
('Python Learning Path', 'Comprehensive guide to learning Python', 'pdf', '/resources/python-learning-path.pdf', ARRAY['Python', 'Learning Path'], 'beginner', null),
('Marketing Templates', 'Email and social media marketing templates', 'link', 'https://example.com/marketing-templates', ARRAY['Marketing', 'Templates', 'Email'], 'beginner', null);

-- Insert sample tutorials
INSERT INTO tutorials (title, description, video_url, thumbnail_url, duration_seconds, tags, skill_level, author_id, is_published) VALUES
('Building a Todo App with React', 'Complete tutorial on creating a todo application using React hooks', '/videos/react-todo-app.mp4', '/thumbnails/react-todo.jpg', 1800, ARRAY['React', 'JavaScript', 'Tutorial'], 'intermediate', null, true),
('CSS Grid Layout Masterclass', 'Learn CSS Grid from basics to advanced techniques', '/videos/css-grid-masterclass.mp4', '/thumbnails/css-grid.jpg', 2400, ARRAY['CSS', 'Layout', 'Grid'], 'intermediate', null, true),
('Introduction to Python Programming', 'Complete beginner guide to Python programming', '/videos/python-intro.mp4', '/thumbnails/python-intro.jpg', 3600, ARRAY['Python', 'Programming', 'Beginner'], 'beginner', null, true),
('Logo Design Process', 'Step-by-step logo design from concept to completion', '/videos/logo-design.mp4', '/thumbnails/logo-design.jpg', 2700, ARRAY['Logo Design', 'Branding', 'Design'], 'intermediate', null, true),
('Node.js API Development', 'Build a REST API with Node.js and Express', '/videos/nodejs-api.mp4', '/thumbnails/nodejs-api.jpg', 4200, ARRAY['Node.js', 'API', 'Backend'], 'advanced', null, true);

-- Insert sample live classes (upcoming)
INSERT INTO live_classes (title, description, host_id, scheduled_at, duration_minutes, max_participants, tags, is_free) VALUES
('React Hooks Deep Dive', 'Advanced React hooks patterns and best practices', null, NOW() + INTERVAL '2 days', 90, 30, ARRAY['React', 'Hooks', 'Advanced'], true),
('Design System Workshop', 'Build a complete design system from scratch', null, NOW() + INTERVAL '5 days', 120, 25, ARRAY['Design System', 'UI/UX', 'Workshop'], false),
('Python Data Analysis', 'Analyze data using pandas and matplotlib', null, NOW() + INTERVAL '1 week', 75, 40, ARRAY['Python', 'Data Analysis', 'Pandas'], true),
('Freelancing 101', 'How to start and grow your freelance business', null, NOW() + INTERVAL '10 days', 60, 50, ARRAY['Freelancing', 'Business', 'Career'], true),
('Advanced CSS Animations', 'Create stunning animations with CSS', null, NOW() + INTERVAL '2 weeks', 90, 35, ARRAY['CSS', 'Animation', 'Advanced'], false);

-- Update room member counts (since we don't have actual members yet, set to 0)
UPDATE topic_rooms SET member_count = 0;
