-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Skills policies (read-only for most users)
CREATE POLICY "Skills are viewable by everyone" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage skills" ON skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Topic rooms policies
CREATE POLICY "Public rooms are viewable by everyone" ON topic_rooms
    FOR SELECT USING (is_public = true);

CREATE POLICY "Private rooms are viewable by members" ON topic_rooms
    FOR SELECT USING (
        is_public = false AND EXISTS (
            SELECT 1 FROM room_memberships 
            WHERE room_id = topic_rooms.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create rooms" ON topic_rooms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Room creators and moderators can update rooms" ON topic_rooms
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM room_memberships 
            WHERE room_id = topic_rooms.id AND user_id = auth.uid() AND is_moderator = true
        )
    );

-- Room memberships policies
CREATE POLICY "Room memberships are viewable by room members" ON room_memberships
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM room_memberships rm 
            WHERE rm.room_id = room_memberships.room_id AND rm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join public rooms" ON room_memberships
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND 
        EXISTS (SELECT 1 FROM topic_rooms WHERE id = room_id AND is_public = true)
    );

CREATE POLICY "Users can leave rooms" ON room_memberships
    FOR DELETE USING (user_id = auth.uid());

-- Posts policies
CREATE POLICY "Posts in public rooms are viewable by everyone" ON posts
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM topic_rooms WHERE id = room_id AND is_public = true)
    );

CREATE POLICY "Posts in private rooms are viewable by members" ON posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_memberships 
            WHERE room_id = posts.room_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Room members can create posts" ON posts
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM room_memberships 
            WHERE room_id = posts.room_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authors and moderators can delete posts" ON posts
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM room_memberships 
            WHERE room_id = posts.room_id AND user_id = auth.uid() AND is_moderator = true
        )
    );

-- Post replies policies
CREATE POLICY "Replies are viewable if parent post is viewable" ON post_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts p
            JOIN topic_rooms tr ON p.room_id = tr.id
            WHERE p.id = post_replies.post_id
            AND (
                tr.is_public = true OR
                EXISTS (
                    SELECT 1 FROM room_memberships 
                    WHERE room_id = tr.id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Room members can reply to posts" ON post_replies
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM posts p
            JOIN room_memberships rm ON p.room_id = rm.room_id
            WHERE p.id = post_replies.post_id AND rm.user_id = auth.uid()
        )
    );

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can create conversations they participate in" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = conversation_id AND auth.uid() = ANY(participant_ids)
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = conversation_id AND auth.uid() = ANY(participant_ids)
        )
    );

-- Questions policies
CREATE POLICY "Questions are viewable by everyone" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can ask questions" ON questions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own questions" ON questions
    FOR UPDATE USING (author_id = auth.uid());

-- Answers policies
CREATE POLICY "Answers are viewable by everyone" ON answers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can answer questions" ON answers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own answers" ON answers
    FOR UPDATE USING (author_id = auth.uid());

-- Vote policies
CREATE POLICY "Users can view all votes" ON question_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can vote on questions" ON question_votes
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own votes" ON question_votes
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own votes" ON question_votes
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view all answer votes" ON answer_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can vote on answers" ON answer_votes
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own answer votes" ON answer_votes
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own answer votes" ON answer_votes
    FOR DELETE USING (user_id = auth.uid());

-- Resources policies
CREATE POLICY "Published resources are viewable by everyone" ON resources
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create resources" ON resources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own resources" ON resources
    FOR UPDATE USING (author_id = auth.uid());

-- Lessons policies
CREATE POLICY "Published lessons are viewable by everyone" ON lessons
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own unpublished lessons" ON lessons
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authenticated users can create lessons" ON lessons
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own lessons" ON lessons
    FOR UPDATE USING (author_id = auth.uid());

-- Lesson progress policies
CREATE POLICY "Users can view their own lesson progress" ON lesson_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can track their own lesson progress" ON lesson_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own lesson progress" ON lesson_progress
    FOR UPDATE USING (user_id = auth.uid());

-- Live classes policies
CREATE POLICY "Scheduled classes are viewable by everyone" ON live_classes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create classes" ON live_classes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Hosts can update their own classes" ON live_classes
    FOR UPDATE USING (host_id = auth.uid());

-- Class enrollments policies
CREATE POLICY "Users can view their own enrollments" ON class_enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Class hosts can view enrollments for their classes" ON class_enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_classes 
            WHERE id = class_id AND host_id = auth.uid()
        )
    );

CREATE POLICY "Users can enroll in classes" ON class_enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Tutorials policies
CREATE POLICY "Published tutorials are viewable by everyone" ON tutorials
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own unpublished tutorials" ON tutorials
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authenticated users can create tutorials" ON tutorials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own tutorials" ON tutorials
    FOR UPDATE USING (author_id = auth.uid());

-- Tutorial progress policies
CREATE POLICY "Users can view their own tutorial progress" ON tutorial_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can track their own tutorial progress" ON tutorial_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tutorial progress" ON tutorial_progress
    FOR UPDATE USING (user_id = auth.uid());

-- Badges policies
CREATE POLICY "Badges are viewable by everyone" ON badges
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage badges" ON badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User badges policies
CREATE POLICY "User badges are viewable by everyone" ON user_badges
    FOR SELECT USING (true);

CREATE POLICY "System can award badges" ON user_badges
    FOR INSERT WITH CHECK (true);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows
    FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON follows
    FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow others" ON follows
    FOR DELETE USING (follower_id = auth.uid());

-- Reports policies
CREATE POLICY "Users can view their own reports" ON reports
    FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports" ON reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Authenticated users can create reports" ON reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update reports" ON reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());
