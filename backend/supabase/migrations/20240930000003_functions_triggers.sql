-- Function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_rooms_updated_at BEFORE UPDATE ON topic_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_classes_updated_at BEFORE UPDATE ON live_classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_progress_updated_at BEFORE UPDATE ON tutorial_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update room member count
CREATE OR REPLACE FUNCTION update_room_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE topic_rooms 
        SET member_count = member_count + 1 
        WHERE id = NEW.room_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE topic_rooms 
        SET member_count = member_count - 1 
        WHERE id = OLD.room_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update room member count
CREATE TRIGGER update_room_member_count_trigger
    AFTER INSERT OR DELETE ON room_memberships
    FOR EACH ROW EXECUTE FUNCTION update_room_member_count();

-- Function to update post reply count
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET reply_count = reply_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET reply_count = reply_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update post reply count
CREATE TRIGGER update_post_reply_count_trigger
    AFTER INSERT OR DELETE ON post_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Function to update question answer count
CREATE OR REPLACE FUNCTION update_question_answer_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE questions 
        SET answer_count = answer_count + 1 
        WHERE id = NEW.question_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE questions 
        SET answer_count = answer_count - 1 
        WHERE id = OLD.question_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update question answer count
CREATE TRIGGER update_question_answer_count_trigger
    AFTER INSERT OR DELETE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_question_answer_count();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_question_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE questions 
        SET upvotes = upvotes + NEW.vote_type 
        WHERE id = NEW.question_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE questions 
        SET upvotes = upvotes - OLD.vote_type 
        WHERE id = OLD.question_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE questions 
        SET upvotes = upvotes - OLD.vote_type + NEW.vote_type 
        WHERE id = NEW.question_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_vote_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON question_votes
    FOR EACH ROW EXECUTE FUNCTION update_question_vote_count();

-- Function to update answer vote counts
CREATE OR REPLACE FUNCTION update_answer_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE answers 
        SET upvotes = upvotes + NEW.vote_type 
        WHERE id = NEW.answer_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE answers 
        SET upvotes = upvotes - OLD.vote_type 
        WHERE id = OLD.answer_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE answers 
        SET upvotes = upvotes - OLD.vote_type + NEW.vote_type 
        WHERE id = NEW.answer_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_answer_vote_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON answer_votes
    FOR EACH ROW EXECUTE FUNCTION update_answer_vote_count();

-- Function to update class participant count
CREATE OR REPLACE FUNCTION update_class_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE live_classes 
        SET participant_count = participant_count + 1 
        WHERE id = NEW.class_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE live_classes 
        SET participant_count = participant_count - 1 
        WHERE id = OLD.class_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_class_participant_count_trigger
    AFTER INSERT OR DELETE ON class_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_class_participant_count();

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
    current_xp INTEGER;
    new_level INTEGER;
BEGIN
    -- Update XP
    UPDATE profiles 
    SET xp = xp + xp_amount 
    WHERE id = user_id
    RETURNING xp INTO current_xp;
    
    -- Calculate new level (simple formula: level = floor(xp / 100) + 1)
    new_level := FLOOR(current_xp / 100.0) + 1;
    
    -- Update level if changed
    UPDATE profiles 
    SET level = new_level 
    WHERE id = user_id AND level != new_level;
END;
$$ LANGUAGE plpgsql;

-- Function to award XP for various actions
CREATE OR REPLACE FUNCTION award_xp_for_action()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'answers' AND TG_OP = 'INSERT' THEN
        -- Award 10 XP for answering a question
        PERFORM update_user_xp(NEW.author_id, 10);
    ELSIF TG_TABLE_NAME = 'answers' AND TG_OP = 'UPDATE' AND NEW.is_best_answer = true AND OLD.is_best_answer = false THEN
        -- Award 50 XP for best answer
        PERFORM update_user_xp(NEW.author_id, 50);
    ELSIF TG_TABLE_NAME = 'lessons' AND TG_OP = 'INSERT' THEN
        -- Award 25 XP for creating a lesson
        PERFORM update_user_xp(NEW.author_id, 25);
    ELSIF TG_TABLE_NAME = 'tutorials' AND TG_OP = 'INSERT' THEN
        -- Award 50 XP for creating a tutorial
        PERFORM update_user_xp(NEW.author_id, 50);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to award XP
CREATE TRIGGER award_xp_for_answers
    AFTER INSERT OR UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION award_xp_for_action();

CREATE TRIGGER award_xp_for_lessons
    AFTER INSERT ON lessons
    FOR EACH ROW EXECUTE FUNCTION award_xp_for_action();

CREATE TRIGGER award_xp_for_tutorials
    AFTER INSERT ON tutorials
    FOR EACH ROW EXECUTE FUNCTION award_xp_for_action();

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET 
        streak_count = CASE 
            WHEN last_active_date = CURRENT_DATE - INTERVAL '1 day' THEN streak_count + 1
            WHEN last_active_date = CURRENT_DATE THEN streak_count
            ELSE 1
        END,
        last_active_date = CURRENT_DATE
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search mentors
CREATE OR REPLACE FUNCTION search_mentors(
    search_query TEXT DEFAULT '',
    skill_filter TEXT[] DEFAULT '{}',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    skills TEXT[],
    xp INTEGER,
    level INTEGER,
    rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.skills,
        p.xp,
        p.level,
        0.0::DECIMAL as rating -- TODO: Calculate actual rating
    FROM profiles p
    WHERE 
        p.role = 'mentor' 
        AND p.is_suspended = false
        AND (
            search_query = '' OR 
            p.full_name ILIKE '%' || search_query || '%' OR
            p.bio ILIKE '%' || search_query || '%'
        )
        AND (
            array_length(skill_filter, 1) IS NULL OR
            p.skills && skill_filter
        )
    ORDER BY p.xp DESC, p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
