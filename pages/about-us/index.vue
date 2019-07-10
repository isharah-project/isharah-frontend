<template>
  <v-container class="mt-3">
    <PageHeader icon="info" text="عن إشارة" />
    <v-card class="medium-round-corners light-box-shadow pa-4">
      <section class="mb-2">
        <p class="subheading">
          موقع إشارة هو مشروع غير ربحي مفتوح المصدر يهدف إلى تجميع مجموعة بيانات للغة الإشارة المصرية من قبل العامة لمساعدة الباحثين في مجال لغة الإشارة المصرية ومساعدة المطورين على بناء تطبيقات تخدم مجتمع الصم في مصر.
        </p>
        <p class="subheading">
          أكثر من 5 ٪ من سكان العالم - أو 466 مليون شخص - يعانون من ضعف السمع (منظمة الصحة العالمية ، 2018)
          وما يقدر بنحو 16 ٪ من سكان مصر - حوالي 13 مليون شخص - يعانون من فقدان السمع. (منظمة الصحة العالمية ، 2007) وهو ما يدفع لزيادة التطوير والبحث المتعلق بتلك الشريحة من المجتمع.
          عدم وجود قاموس رقمي ومجموعة بيانات رقمية للغة الإشارة المصرية يشكل عائق كبير للباحثين والمطورين وهو ما يعمل موقع إشارة لحله.
          <br>
          ستكون البيانات التي يجمعها الموقع متوفرة عبر هذا الموقع للاستخدام في البحث العلمي والتطبيقات غير الربحية.
        </p>
      </section>
      <section class="mb-2">
        <h1 class="pb-2">
          آلية عمل الموقع
        </h1>
        <p class="subheading">
          يقوم  متطوعين خبراء بلغة الإشارة بتقييم (قبول أو رفض) تلك الإشارات بناء على عدة عوامل (صحة الإشارة, الإضاءة، زاوية التصوير، الجزء الواضح من اليدين والجسد وغيرها) لنحرص على جودة البيانات.
        </p>
        <p class="subheading">
          عند إضافة كل إشارة ينمو حجم قاموس لغة الإشارة الرقمي الموجود على موقعنا كما تنمو مجموعة البيانات التي نهدف لأن تحتوي على تكرارات كثيرة لنفس الكلمة يقوم بأدائها عدة أشخاص لتكون مجموعة بيانات عامة غير معتمدة على أشخاص معينين "Signer Independent".
        </p>
        <p class="subheading">
          كل إشارة تمثل كلمة واحدة فهي مجموعة بيانات للكلمات المنعزلة "Isolated Word Dataset" وليس الجمل. ولكننا نهدف لتجمييع بيانات للجمل "Continuous Dataset" أيضاً في المستقبل.
        </p>
        <p class="subheading font-weight-bold">
          إذا كنت مطور، يمكنك المشاركة في تحسين الموقع على
          <a class="grey-text" href="https://github.com/isharah-project">github</a>
        </p>
      </section>
      <section class="mb-2">
        <h1 class="pb-2">
          الشكر والتقدير
        </h1>
        <p class="subheading">
          ساهم عدد من الناس في إنشاء موقع إشارة. وجب شكرهم جميعاً وهم
        </p>
        <p>
          <ul class="pr-4">
            <li>
              <b>
                الدكتور أحمد السيد - كلية الهندسة جامعة الأسكندرية
              </b>
              للإشراف على المشروع
            </li>
            <li>
              <b>
                جمعية أصداء والأستاذ سامي رئيس مجلس الإدارة
              </b>
              لمجهودهم في شرح احتياجات مجتمع الصم وتوصيل ثقافتهم للمطورين والمصممين القائمين على الموقع ولتوفيرهم من يقوم باستخدام النسخ التجريبية للموقع وتقييمها وتوفير خبراء بلغة الإشارة
            </li>
            <li>
              <b>
                المهندس أحمد حمدي, جامعة الإسكندرية
              </b>
              لتسهيل تواصلنا مع جمعية أصداء
            </li>
            <li>
              <b>
                كتاب "قاموس لغة الإشارة المصرية"
              </b>
              الذي ساعدنا على انتقاء المفردات الهامة في اللغة
            </li>
            <li>
              <b>
                Junfu Pu, Ph.D candidate, University of Science and Technology of China
              </b>
              for providing us with easy access to the Chinese sign language datasets that helped us train and benchmark our models on a Sign Language Dataset
            </li>
          </ul>
        </p>
      </section>
      <section class="mb-2">
        <h1 class="pb-2">
          فريق المشروع
        </h1>
        <ul class="pr-4 mb-2">
          <li>
            تصميم واجهة المستخدم (website UI design):
            <a class="grey-text" href="https://www.behance.net/amrahmedismail">
              عمرو إسماعيل
            </a>
          </li>
        </ul>
        <ul class="pr-4">
          <li>
            <a class="grey-text" href="https://www.linkedin.com/in/tarek-alqaddy/">
              م.طارق القاضي
            </a>
          </li>
          <li>
            <a class="grey-text" href="https://www.linkedin.com/in/abdelrahman-abdelnabi/">
              م.عبدالرحمن عبدالنبي
            </a>
          </li>
          <li>
            <a class="grey-text" href="https://www.linkedin.com/in/essam-ewaisha-2738b3102/">
              م.عصام عويشة
            </a>
          </li>
          <li>
            <a class="grey-text" href="https://www.linkedin.com/in/miral-el-nahas-841430131/">
              م.ميرال النحاس
            </a>
          </li>
          <li>
            <a class="grey-text" href="https://www.linkedin.com/in/yaraabdullatif/">
              م.يارا عبداللطيف
            </a>
          </li>
          <li>
            <a class="grey-text" href="https://www.linkedin.com/in/youssef-fares/">
              م.يوسف فارس
            </a>
          </li>
        </ul>
      </section>
    </v-card>
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'

export default {
  components: {
    PageHeader
  }
}
</script>

<style>
section > p {
  padding-bottom: 16px;
}
</style>
