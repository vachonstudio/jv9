-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('subscriber', 'editor', 'admin', 'super_admin');
create type role_request_status as enum ('pending', 'approved', 'denied');
create type content_access_level as enum ('public', 'private', 'premium');
create type content_type as enum ('project', 'blog_post', 'gradient');

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  avatar text,
  bio text,
  role user_role not null default 'subscriber',
  profile_image text,
  background_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  industry text,
  role text,
  image text,
  tags text[],
  technologies text[],
  challenges text[],
  outcomes text[],
  access_level content_access_level not null default 'public',
  content jsonb, -- For flexible content blocks
  is_featured boolean default false,
  author_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog posts table
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  excerpt text not null,
  category text not null,
  tags text[],
  featured_image text,
  access_level content_access_level not null default 'public',
  content jsonb, -- For flexible content blocks
  read_time integer,
  is_featured boolean default false,
  author_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gradients table
create table gradients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  colors text[] not null,
  css text not null,
  tags text[],
  is_custom boolean default false,
  author_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favorites table
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  content_id uuid not null,
  content_type content_type not null,
  metadata jsonb, -- For storing additional info like title, image, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, content_id, content_type)
);

-- Role requests table
create table role_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  requested_role user_role not null,
  current_role user_role not null,
  reason text,
  status role_request_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contact submissions table
create table contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  company text,
  services text[],
  budget text,
  timeline text,
  message text not null,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table gradients enable row level security;
alter table favorites enable row level security;
alter table role_requests enable row level security;
alter table contact_submissions enable row level security;

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Projects policies
create policy "Public projects are viewable by everyone" on projects
  for select using (access_level = 'public');

create policy "Authenticated users can view private projects" on projects
  for select using (
    auth.uid() is not null and access_level in ('private', 'premium')
  );

create policy "Editors and above can insert projects" on projects
  for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('editor', 'admin', 'super_admin')
    )
  );

create policy "Editors and above can update projects" on projects
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('editor', 'admin', 'super_admin')
    )
  );

create policy "Admins and above can delete projects" on projects
  for delete using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Blog posts policies (similar to projects)
create policy "Public blog posts are viewable by everyone" on blog_posts
  for select using (access_level = 'public');

create policy "Authenticated users can view private blog posts" on blog_posts
  for select using (
    auth.uid() is not null and access_level in ('private', 'premium')
  );

create policy "Editors and above can insert blog posts" on blog_posts
  for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('editor', 'admin', 'super_admin')
    )
  );

create policy "Editors and above can update blog posts" on blog_posts
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('editor', 'admin', 'super_admin')
    )
  );

create policy "Admins and above can delete blog posts" on blog_posts
  for delete using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Gradients policies
create policy "All gradients are viewable by everyone" on gradients
  for select using (true);

create policy "Authenticated users can insert gradients" on gradients
  for insert with check (auth.uid() is not null);

create policy "Users can update their own gradients" on gradients
  for update using (auth.uid() = author_id);

create policy "Users can delete their own gradients" on gradients
  for delete using (auth.uid() = author_id);

-- Favorites policies
create policy "Users can view their own favorites" on favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites" on favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites" on favorites
  for delete using (auth.uid() = user_id);

-- Role requests policies
create policy "Users can view their own role requests" on role_requests
  for select using (auth.uid() = user_id);

create policy "Admins can view all role requests" on role_requests
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

create policy "Users can insert their own role requests" on role_requests
  for insert with check (auth.uid() = user_id);

create policy "Admins can update role requests" on role_requests
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Contact submissions policies
create policy "Anyone can insert contact submissions" on contact_submissions
  for insert with check (true);

create policy "Admins can view contact submissions" on contact_submissions
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Functions and triggers

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role user_role := 'subscriber';
begin
  -- Check if this is the super admin email
  if new.email = 'vachon@gmail.com' then
    user_role := 'super_admin';
  end if;

  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    user_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all relevant tables
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_projects_updated_at before update on projects
  for each row execute procedure update_updated_at_column();

create trigger update_blog_posts_updated_at before update on blog_posts
  for each row execute procedure update_updated_at_column();

create trigger update_gradients_updated_at before update on gradients
  for each row execute procedure update_updated_at_column();

create trigger update_role_requests_updated_at before update on role_requests
  for each row execute procedure update_updated_at_column();

-- Indexes for better performance
create index idx_projects_access_level on projects(access_level);
create index idx_projects_category on projects(category);
create index idx_projects_is_featured on projects(is_featured);
create index idx_blog_posts_access_level on blog_posts(access_level);
create index idx_blog_posts_category on blog_posts(category);
create index idx_blog_posts_is_featured on blog_posts(is_featured);
create index idx_favorites_user_content on favorites(user_id, content_type);
create index idx_role_requests_status on role_requests(status);
create index idx_contact_submissions_status on contact_submissions(status);