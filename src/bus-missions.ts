import type { Locale } from "./i18n";
import { ageBandFor, type Question } from "./school-data";

type MissionBand = "early" | "school" | "advanced";

const missions: Record<string, Record<MissionBand, Question[]>> = {
  museum: {
    early: [
      { prompt: "Stop 1: Which happened first?", answers: ["A seed was planted", "A flower opened", "A fruit grew"], correct: 0, hint: "Plants begin as seeds.", explanation: "A seed must be planted before the plant can flower or grow fruit." },
      { prompt: "Stop 2: Put the school day in order. What comes after morning?", answers: ["Afternoon", "Yesterday", "Winter"], correct: 0, hint: "Think about lunch time.", explanation: "Afternoon follows morning in a day." },
      { prompt: "Final stop: Which object helps us know the time?", answers: ["Clock", "Crayon", "Cup"], correct: 0, hint: "Look for the object with hands or numbers.", explanation: "Clocks measure and show time." },
    ],
    school: [
      { prompt: "Stop 1: A bus leaves at 9:15 and travels for 35 minutes. When does it arrive?", answers: ["9:40", "9:50", "10:00", "10:15"], correct: 1, hint: "Add 30 minutes, then 5 more.", explanation: "9:15 plus 35 minutes is 9:50." },
      { prompt: "Stop 2: Which source is primary evidence about a 1920 school day?", answers: ["A pupil’s 1920 diary", "A modern novel", "An unsourced video", "A guess"], correct: 0, hint: "Choose evidence created at the time.", explanation: "A diary written in 1920 is a first-hand primary source." },
      { prompt: "Final stop: An exhibit opened in 1985. How old is it in 2025?", answers: ["30 years", "35 years", "40 years", "45 years"], correct: 2, hint: "Subtract 1985 from 2025.", explanation: "2025 − 1985 = 40." },
    ],
    advanced: [
      { prompt: "Stop 1: Which practice best checks the provenance of an archival letter?", answers: ["Verify its origin and chain of custody", "Trust its age alone", "Count its paragraphs", "Prefer the neatest handwriting"], correct: 0, hint: "Provenance is the documented history of an item.", explanation: "Origin and chain of custody help establish whether an archive item is authentic." },
      { prompt: "Stop 2: A clock loses 2 minutes every 3 hours. How much does it lose in 24 hours?", answers: ["8 minutes", "12 minutes", "16 minutes", "18 minutes"], correct: 2, hint: "There are eight 3-hour periods in 24 hours.", explanation: "8 periods × 2 minutes = 16 minutes." },
      { prompt: "Final stop: Two accounts disagree about an event. What is the strongest next step?", answers: ["Triangulate them with independent evidence", "Keep only the longer account", "Average their word counts", "Reject both automatically"], correct: 0, hint: "Look for corroboration from other reliable sources.", explanation: "Triangulation tests competing accounts against independent evidence." },
    ],
  },
  eco: {
    early: [
      { prompt: "Stop 1: Which one belongs in a forest?", answers: ["Tree", "Toaster", "Bathtub"], correct: 0, hint: "Choose the living plant.", explanation: "Trees are living parts of forest habitats." },
      { prompt: "Stop 2: What do thirsty plants need?", answers: ["Water", "Plastic", "Paint"], correct: 0, hint: "Rain gives plants this.", explanation: "Plants need water to live and grow." },
      { prompt: "Stop 3: Where should an empty snack wrapper go?", answers: ["In a bin", "In a stream", "Under a flower"], correct: 0, hint: "Choose the place that keeps the forest clean.", explanation: "Using a bin protects wildlife and keeps habitats clean." },
      { prompt: "Final stop: Which animal could live in a tree?", answers: ["Bird", "Whale", "Octopus"], correct: 0, hint: "This animal can fly and build a nest.", explanation: "Many birds build nests and live in trees." },
    ],
    school: [
      { prompt: "Stop 1: Which is a producer in a forest food chain?", answers: ["Oak tree", "Fox", "Owl", "Mushroom"], correct: 0, hint: "Producers make food using sunlight.", explanation: "An oak tree uses photosynthesis to make its food." },
      { prompt: "Stop 2: Which measurement best tracks stream pollution?", answers: ["Water pH over time", "Tree height once", "Cloud shape", "Path width"], correct: 0, hint: "Choose a repeatable water-quality measurement.", explanation: "Repeated pH measurements can reveal changing water conditions." },
      { prompt: "Stop 3: Why leave dead wood in some woodland areas?", answers: ["It provides habitat and recycles nutrients", "It stops every plant growing", "It makes animals leave", "It removes all fungi"], correct: 0, hint: "Decomposers and small animals use it.", explanation: "Dead wood supports habitats and returns nutrients to the ecosystem." },
      { prompt: "Final stop: Which plan is a fair test of light and seedling growth?", answers: ["Change light only and keep water equal", "Change light and water together", "Use different plant species", "Measure only one plant once"], correct: 0, hint: "A fair test changes one variable.", explanation: "Keeping other conditions equal isolates the effect of light." },
    ],
    advanced: [
      { prompt: "Stop 1: Which measure captures the variety and balance of species in a sample?", answers: ["A diversity index", "The tallest tree only", "Air temperature alone", "The path length"], correct: 0, hint: "Look for a measure combining richness and abundance.", explanation: "Diversity indices consider how many species occur and how evenly individuals are distributed." },
      { prompt: "Stop 2: A river nitrate reading rises downstream of farms. What is the best first inference?", answers: ["Agricultural runoff is a hypothesis to test", "Farms are proven to be the only cause", "The instrument must be wrong", "Nitrate cannot move in water"], correct: 0, hint: "Association suggests a testable explanation, not proof.", explanation: "The pattern supports testing runoff while retaining other possible explanations." },
      { prompt: "Stop 3: Why include an upstream reference site in the survey?", answers: ["To estimate baseline conditions", "To guarantee causation", "To increase nitrate levels", "To remove seasonal variation"], correct: 0, hint: "A reference offers a comparison.", explanation: "Upstream measurements help establish conditions before the suspected impact." },
      { prompt: "Final stop: Which restoration outcome is most scientifically defensible?", answers: ["Pre-registered indicators improve across repeated surveys", "One photograph looks greener", "A visitor says it feels better", "Only the easiest site is measured"], correct: 0, hint: "Choose planned, repeatable evidence.", explanation: "Predefined indicators and repeated sampling reduce selective interpretation." },
    ],
  },
  space: {
    early: [
      { prompt: "Stop 1: Which shape is round like the Moon?", answers: ["Circle", "Triangle", "Square"], correct: 0, hint: "It has no corners.", explanation: "A circle is round and has no corners." },
      { prompt: "Stop 2: Count the rockets: 🚀 🚀 🚀 🚀", answers: ["3", "4", "5"], correct: 1, hint: "Point to each rocket while counting.", explanation: "There are four rockets." },
      { prompt: "Stop 3: Which word starts with the same sound as moon?", answers: ["Map", "Sun", "Light"], correct: 0, hint: "Listen for the /m/ sound.", explanation: "Moon and map both begin with the /m/ sound." },
      { prompt: "Stop 4: What helps an astronaut breathe in space?", answers: ["A spacesuit", "A raincoat", "A scarf"], correct: 0, hint: "It carries safe air.", explanation: "A spacesuit supplies oxygen and protects an astronaut." },
      { prompt: "Final stop: Which comes after 9?", answers: ["8", "10", "12"], correct: 1, hint: "Count one more.", explanation: "Ten comes directly after nine." },
    ],
    school: [
      { prompt: "Stop 1: A grid position is (4, 2). Which number gives the horizontal coordinate?", answers: ["2", "4", "6", "8"], correct: 1, hint: "Coordinates are written (x, y).", explanation: "The first value, 4, is the horizontal x-coordinate." },
      { prompt: "Stop 2: Why does the Moon appear bright?", answers: ["It reflects sunlight", "It makes its own visible light", "It is made of fire", "It reflects city lights"], correct: 0, hint: "Think about the Sun as the light source.", explanation: "Sunlight reflects from the Moon’s surface." },
      { prompt: "Stop 3: A signal takes 2 seconds to arrive. At 300,000 km/s, how far did it travel?", answers: ["150,000 km", "300,000 km", "600,000 km", "900,000 km"], correct: 2, hint: "Distance = speed × time.", explanation: "300,000 km/s × 2 s = 600,000 km." },
      { prompt: "Stop 4: Which summary is supported by a star chart?", answers: ["The plotted stars form a recorded pattern", "Every star is the same distance away", "Stars never move", "The chart proves alien life"], correct: 0, hint: "Do not claim more than the visual evidence shows.", explanation: "The chart supports the recorded pattern, not unrelated or absolute claims." },
      { prompt: "Final stop: Which unit is most useful for distances between stars?", answers: ["Light-year", "Centimetre", "Millilitre", "Degree Celsius"], correct: 0, hint: "This unit describes how far light travels in a year.", explanation: "A light-year is a distance unit suited to interstellar scales." },
    ],
    advanced: [
      { prompt: "Stop 1: A probe at (−2, 5) translates by vector (4, −3). What is its new position?", answers: ["(2, 2)", "(−6, 8)", "(2, 8)", "(−6, 2)"], correct: 0, hint: "Add corresponding components.", explanation: "(−2 + 4, 5 − 3) = (2, 2)." },
      { prompt: "Stop 2: Redshift in a distant galaxy’s spectrum most directly indicates…", answers: ["It is receding relative to us", "It has no gravity", "It is necessarily younger", "Its stars are all red"], correct: 0, hint: "Longer observed wavelengths reveal relative motion.", explanation: "Cosmological or Doppler redshift indicates recession relative to the observer." },
      { prompt: "Stop 3: Why must a lunar library control temperature swings?", answers: ["Extreme cycles can damage materials and electronics", "The Moon has daily rain", "Paper becomes weightless", "Gravity creates oxygen"], correct: 0, hint: "Consider thermal expansion and equipment limits.", explanation: "Large temperature changes stress materials and can exceed safe operating ranges." },
      { prompt: "Stop 4: Which redundancy best protects an irreplaceable archive?", answers: ["Checksummed copies in independent locations", "One unverified local copy", "A screenshot of each filename", "Renaming every file"], correct: 0, hint: "Protect both integrity and availability.", explanation: "Independent, checksummed copies allow corruption detection and disaster recovery." },
      { prompt: "Final stop: A model predicts an eclipse one minute late. What should researchers do?", answers: ["Quantify residuals and investigate assumptions", "Alter the observation to fit", "Declare the model perfect", "Discard all timing data"], correct: 0, hint: "Treat the difference as evidence about the model.", explanation: "Residual analysis can reveal measurement error or an incomplete model." },
    ],
  },
};

function mq(prompt: string, answers: string[], correct: number, hint: string, explanation: string): Question {
  return { prompt, answers, correct, hint, explanation };
}

const missionsAr: Record<string, Record<MissionBand, Question[]>> = {
  museum: {
    early: [
      mq("المحطة ١: أي شيء حدث أولاً؟", ["زُرعت بذرة", "تفتحت زهرة", "نمت ثمرة"], 0, "تبدأ النباتات من البذور.", "لا بد من زراعة البذرة قبل أن تزهر النبتة أو تنتج ثمرة."),
      mq("المحطة ٢: رتّب اليوم الدراسي. ماذا يأتي بعد الصباح؟", ["بعد الظهر", "الأمس", "الشتاء"], 0, "فكّر في وقت الغداء.", "يأتي وقت بعد الظهر عقب الصباح."),
      mq("المحطة الأخيرة: أي أداة تساعدنا على معرفة الوقت؟", ["الساعة", "قلم التلوين", "الكوب"], 0, "ابحث عن أداة فيها عقارب أو أرقام.", "تقيس الساعة الوقت وتعرضه."),
    ],
    school: [
      mq("المحطة ١: انطلقت الحافلة الساعة ٩:١٥ واستغرقت ٣٥ دقيقة. متى وصلت؟", ["٩:٤٠", "٩:٥٠", "١٠:٠٠", "١٠:١٥"], 1, "أضف ثلاثين دقيقة ثم خمس دقائق.", "الساعة ٩:١٥ زائد ٣٥ دقيقة تساوي ٩:٥٠."),
      mq("المحطة ٢: ما المصدر الأولي عن يوم دراسي سنة ١٩٢٠؟", ["مذكرات طالب كتبها عام ١٩٢٠", "رواية حديثة", "فيديو بلا مصدر", "تخمين"], 0, "اختر دليلاً أُنشئ في الزمن نفسه.", "المذكرات المكتوبة عام ١٩٢٠ مصدر مباشر وأولي."),
      mq("المحطة الأخيرة: افتُتح معرض عام ١٩٨٥. كم بلغ عمره عام ٢٠٢٥؟", ["٣٠ سنة", "٣٥ سنة", "٤٠ سنة", "٤٥ سنة"], 2, "اطرح ١٩٨٥ من ٢٠٢٥.", "٢٠٢٥ − ١٩٨٥ = ٤٠ سنة."),
    ],
    advanced: [
      mq("المحطة ١: ما أفضل طريقة للتحقق من أصل رسالة أرشيفية؟", ["التحقق من منشئها وسلسلة حيازتها", "الثقة بعمرها فقط", "عدّ فقراتها", "اختيار أجمل خط"], 0, "الأصل هو التاريخ الموثق للقطعة.", "يساعد المصدر وسجل الحيازة على إثبات أصالة المادة الأرشيفية."),
      mq("المحطة ٢: تتأخر ساعة دقيقتين كل ٣ ساعات. كم تتأخر خلال ٢٤ ساعة؟", ["٨ دقائق", "١٢ دقيقة", "١٦ دقيقة", "١٨ دقيقة"], 2, "في اليوم ثماني فترات من ثلاث ساعات.", "ثماني فترات × دقيقتين = ١٦ دقيقة."),
      mq("المحطة الأخيرة: اختلفت روايتان عن حدث. ما الخطوة الأقوى؟", ["مقارنتهما بأدلة مستقلة", "الاحتفاظ بالرواية الأطول", "حساب متوسط كلمات الروايتين", "رفضهما فوراً"], 0, "ابحث عن تأييد من مصادر أخرى موثوقة.", "تختبر المقارنة المنهجية الروايتين في ضوء أدلة مستقلة."),
    ],
  },
  eco: {
    early: [
      mq("المحطة ١: أي شيء ينتمي إلى الغابة؟", ["شجرة", "محمصة خبز", "حوض استحمام"], 0, "اختر النبتة الحية.", "الأشجار كائنات حية أساسية في موطن الغابة."),
      mq("المحطة ٢: ماذا تحتاج النباتات العطشى؟", ["الماء", "البلاستيك", "الطلاء"], 0, "يمنح المطر النباتات هذا الشيء.", "تحتاج النباتات إلى الماء لتعيش وتنمو."),
      mq("المحطة ٣: أين نضع غلاف الوجبة الفارغ؟", ["في سلة المهملات", "في الجدول", "تحت زهرة"], 0, "اختر المكان الذي يبقي الغابة نظيفة.", "استخدام السلة يحمي الحيوانات ويحافظ على نظافة الموطن."),
      mq("المحطة الأخيرة: أي حيوان يمكن أن يعيش على شجرة؟", ["طائر", "حوت", "أخطبوط"], 0, "يمكن لهذا الحيوان الطيران وبناء عش.", "تبني طيور كثيرة أعشاشها وتعيش على الأشجار."),
    ],
    school: [
      mq("المحطة ١: من المنتج في سلسلة غذاء الغابة؟", ["شجرة البلوط", "الثعلب", "البومة", "الفطر"], 0, "يصنع المنتج غذاءه باستخدام الشمس.", "تصنع شجرة البلوط غذاءها بعملية البناء الضوئي."),
      mq("المحطة ٢: أي قياس يتابع تلوث الجدول بصورة أفضل؟", ["درجة حموضة الماء مع الزمن", "ارتفاع شجرة مرة واحدة", "شكل الغيمة", "عرض المسار"], 0, "اختر قياساً متكرراً لجودة الماء.", "تكشف قياسات الحموضة المتكررة تغير حالة الماء."),
      mq("المحطة ٣: لماذا يُترك الخشب الميت في بعض الغابات؟", ["يوفر موطناً ويعيد المغذيات", "يوقف نمو كل النباتات", "يطرد الحيوانات", "يزيل كل الفطريات"], 0, "تستخدمه المحللات والحيوانات الصغيرة.", "يدعم الخشب الميت المواطن ويعيد المغذيات إلى النظام البيئي."),
      mq("المحطة الأخيرة: ما الخطة العادلة لاختبار أثر الضوء في نمو الشتلات؟", ["غيّر الضوء فقط وثبّت الماء", "غيّر الضوء والماء معاً", "استخدم أنواعاً مختلفة", "قس نبتة واحدة مرة"], 0, "يغيّر الاختبار العادل متغيراً واحداً.", "عند تثبيت الظروف الأخرى نعزل أثر الضوء."),
    ],
    advanced: [
      mq("المحطة ١: أي مقياس يجمع تنوع الأنواع وتوازن أعدادها؟", ["مؤشر التنوع", "أطول شجرة فقط", "حرارة الهواء وحدها", "طول المسار"], 0, "ابحث عن مقياس يجمع الثراء والوفرة.", "تراعي مؤشرات التنوع عدد الأنواع ومدى توازن توزيع الأفراد."),
      mq("المحطة ٢: ارتفع النترات في النهر بعد مناطق زراعية. ما أول استنتاج سليم؟", ["الجريان الزراعي فرضية يجب اختبارها", "المزارع هي السبب الوحيد حتماً", "الجهاز خاطئ حتماً", "النترات لا تتحرك في الماء"], 0, "الارتباط يقترح تفسيراً قابلاً للاختبار ولا يثبته.", "يدعم النمط اختبار الجريان الزراعي مع إبقاء تفسيرات أخرى ممكنة."),
      mq("المحطة ٣: لماذا نضيف موقعاً مرجعياً أعلى مجرى النهر؟", ["لتقدير الحالة الأساسية", "لضمان السببية", "لزيادة النترات", "لإزالة التغير الموسمي"], 0, "يوفر الموقع المرجعي أساساً للمقارنة.", "توضح القياسات أعلى المجرى الظروف قبل الأثر المشتبه فيه."),
      mq("المحطة الأخيرة: أي نتيجة لترميم الغابة أكثر قوة علمياً؟", ["تحسن مؤشرات محددة مسبقاً عبر مسوح متكررة", "صورة واحدة تبدو أكثر خضرة", "رأي زائر", "قياس أسهل موقع فقط"], 0, "اختر دليلاً مخططاً وقابلاً للتكرار.", "تقلل المؤشرات المحددة والتكرار من الانتقائية في تفسير النتائج."),
    ],
  },
  space: {
    early: [
      mq("المحطة ١: أي شكل مستدير مثل القمر؟", ["دائرة", "مثلث", "مربع"], 0, "ليس له زوايا.", "الدائرة مستديرة ولا تحتوي على زوايا."),
      mq("المحطة ٢: عُد الصواريخ: 🚀 🚀 🚀 🚀", ["٣", "٤", "٥"], 1, "أشر إلى كل صاروخ وأنت تعد.", "يوجد أربعة صواريخ."),
      mq("المحطة ٣: أي كلمة تبدأ بالصوت نفسه الذي تبدأ به كلمة «موز»؟", ["ماء", "شمس", "نور"], 0, "استمع إلى صوت حرف الميم.", "كلمتا موز وماء تبدآن بصوت الميم."),
      mq("المحطة ٤: ما الذي يساعد رائد الفضاء على التنفس؟", ["بدلة الفضاء", "معطف المطر", "وشاح"], 0, "يحمل هواءً آمناً.", "تزود بدلة الفضاء الرائد بالأكسجين وتحميه."),
      mq("المحطة الأخيرة: أي عدد يأتي بعد ٩؟", ["٨", "١٠", "١٢"], 1, "عُد واحداً إضافياً.", "العدد عشرة يأتي مباشرة بعد التسعة."),
    ],
    school: [
      mq("المحطة ١: موضع على الشبكة هو (٤، ٢). أي عدد يمثل الإحداثي الأفقي؟", ["٢", "٤", "٦", "٨"], 1, "تُكتب الإحداثيات بالصورة (س، ص).", "القيمة الأولى، ٤، هي الإحداثي الأفقي."),
      mq("المحطة ٢: لماذا يبدو القمر مضيئاً؟", ["يعكس ضوء الشمس", "يصنع ضوءه المرئي", "مكوّن من النار", "يعكس أضواء المدن"], 0, "فكّر في الشمس كمصدر للضوء.", "ينعكس ضوء الشمس عن سطح القمر."),
      mq("المحطة ٣: وصلت إشارة خلال ثانيتين بسرعة ٣٠٠ ألف كم/ث. ما المسافة؟", ["١٥٠ ألف كم", "٣٠٠ ألف كم", "٦٠٠ ألف كم", "٩٠٠ ألف كم"], 2, "المسافة = السرعة × الزمن.", "٣٠٠ ألف كم/ث × ثانيتين = ٦٠٠ ألف كم."),
      mq("المحطة ٤: أي خلاصة تدعمها خريطة النجوم؟", ["النجوم المرسومة تكوّن نمطاً مسجلاً", "كل النجوم على البعد نفسه", "النجوم لا تتحرك", "الخريطة تثبت وجود حياة فضائية"], 0, "لا تتجاوز في استنتاجك ما يعرضه الدليل.", "تدعم الخريطة النمط المسجل فقط، لا ادعاءات مطلقة أخرى."),
      mq("المحطة الأخيرة: ما الوحدة الأنسب للمسافات بين النجوم؟", ["السنة الضوئية", "السنتيمتر", "الملليلتر", "الدرجة المئوية"], 0, "تصف المسافة التي يقطعها الضوء في سنة.", "السنة الضوئية وحدة مسافة مناسبة للمقاييس بين النجوم."),
    ],
    advanced: [
      mq("المحطة ١: مسبار عند (−٢، ٥) تحرك بالمتجه (٤، −٣). ما موضعه الجديد؟", ["(٢، ٢)", "(−٦، ٨)", "(٢، ٨)", "(−٦، ٢)"], 0, "اجمع المركبات المتناظرة.", "(−٢ + ٤، ٥ − ٣) = (٢، ٢)."),
      mq("المحطة ٢: يدل الانزياح الأحمر في طيف مجرة بعيدة مباشرة على أنها...", ["تبتعد عنا نسبياً", "بلا جاذبية", "أصغر عمراً حتماً", "كل نجومها حمراء"], 0, "تكشف الأطوال الموجية المرصودة الأطول حركة نسبية.", "يدل الانزياح الكوني أو دوبلر على ابتعاد المصدر عن الراصد."),
      mq("المحطة ٣: لماذا يجب ضبط تقلبات الحرارة في مكتبة قمرية؟", ["قد تضر المواد والإلكترونيات", "على القمر أمطار يومية", "الورق يصبح بلا وزن", "الجاذبية تصنع الأكسجين"], 0, "فكّر في التمدد الحراري وحدود الأجهزة.", "تجهد الفروق الحرارية الكبيرة المواد وقد تتجاوز حدود تشغيل المعدات."),
      mq("المحطة ٤: أي تكرار يحمي أرشيفاً لا يمكن تعويضه؟", ["نسخ ببصمات تحقق في مواقع مستقلة", "نسخة محلية واحدة بلا تحقق", "صورة لأسماء الملفات", "إعادة تسمية الملفات"], 0, "احمِ سلامة البيانات وتوفرها معاً.", "تكشف بصمات التحقق التلف، وتتيح المواقع المستقلة التعافي من الكوارث."),
      mq("المحطة الأخيرة: تنبأ نموذج بخسوف متأخراً دقيقة. ماذا يفعل الباحثون؟", ["يقيسون البواقي ويفحصون الافتراضات", "يغيرون الرصد ليلائم النموذج", "يعلنون كمال النموذج", "يحذفون بيانات الوقت"], 0, "تعامل مع الفرق بوصفه دليلاً عن النموذج.", "قد يكشف تحليل البواقي خطأً في القياس أو قصوراً في النموذج."),
    ],
  },
};

function missionBandFor(level: string): MissionBand {
  const band = ageBandFor(level);
  if (band === "early") return "early";
  if (band === "primary" || band === "middle") return "school";
  return "advanced";
}

export function missionFor(routeId: string, level: string, locale: Locale = "en") {
  const source = locale === "ar" ? missionsAr : missions;
  const route = source[routeId] ?? source.museum;
  return route[missionBandFor(level)];
}

export const missionQuestionCount = Object.values(missions).reduce(
  (total, groups) => total + Object.values(groups).reduce((subtotal, questions) => subtotal + questions.length, 0),
  0,
);

export const arabicMissionQuestionCount = Object.values(missionsAr).reduce(
  (total, groups) => total + Object.values(groups).reduce((subtotal, questions) => subtotal + questions.length, 0),
  0,
);
