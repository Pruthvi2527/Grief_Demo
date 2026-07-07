-- Seed course sections and exercises for the MVP dashboard

INSERT INTO public.sections (title, description, order_index)
VALUES
  (
    'Finding Stability',
    'Ground yourself with gentle practices that help you feel steadier in difficult moments.',
    0
  ),
  (
    'Understanding Grief',
    'Learn how grief shows up in your body, mind, and daily life.',
    1
  ),
  (
    'Processing Emotions',
    'Make space for the feelings that arise without becoming overwhelmed.',
    2
  ),
  (
    'Reconnecting with Life',
    'Explore small steps toward meaning, connection, and hope.',
    3
  ),
  (
    'Moving Forward',
    'Integrate what you have learned and carry it into everyday life.',
    4
  )
ON CONFLICT (order_index) DO NOTHING;

INSERT INTO public.exercises (
  section_id,
  title,
  description,
  content_type,
  order_index,
  duration_min
)
SELECT
  s.id,
  e.title,
  e.description,
  e.content_type::public.exercise_content_type,
  e.order_index,
  e.duration_min
FROM public.sections s
JOIN (
  VALUES
    (
      0,
      'Grounding Through Breath',
      'A short guided breathing exercise to help you feel more present.',
      'audio',
      0,
      5
    ),
    (
      0,
      'Body Scan Relaxation',
      'Slowly scan your body with kindness and release tension.',
      'audio',
      1,
      8
    ),
    (
      0,
      'Creating a Safe Anchor',
      'Identify a memory or image that helps you feel held.',
      'text',
      2,
      6
    ),
    (
      1,
      'What Grief Looks Like',
      'Reflect on how grief has appeared in your experience so far.',
      'text',
      0,
      7
    ),
    (
      1,
      'The Waves of Feeling',
      'Understand why emotions can feel unpredictable after loss.',
      'mixed',
      1,
      10
    ),
    (
      2,
      'Naming What Hurts',
      'Put words to what feels heavy without fixing it yet.',
      'text',
      0,
      6
    ),
    (
      2,
      'Writing to Your Grief',
      'A gentle journaling prompt to express what is unspoken.',
      'text',
      1,
      12
    ),
    (
      3,
      'One Small Connection',
      'Notice one person, place, or ritual that still feels warm.',
      'text',
      0,
      5
    ),
    (
      3,
      'Moments of Meaning',
      'Capture a memory that still carries love or significance.',
      'mixed',
      1,
      9
    ),
    (
      4,
      'Your Continued Story',
      'Look ahead with compassion for who you are becoming.',
      'text',
      0,
      8
    )
) AS e(section_order, title, description, content_type, order_index, duration_min)
  ON s.order_index = e.section_order
WHERE NOT EXISTS (
  SELECT 1
  FROM public.exercises existing
  WHERE existing.section_id = s.id
    AND existing.order_index = e.order_index
);
