<!-- Form for getting events (all, from user for now) (inline style) -->

<script>
import InlineFormBlank from '@/components/common/InlineFormBlank.vue';

export default {
  name: 'GetEventsFormBlank',
  mixins: [InlineFormBlank],
  data() {
    return {value: this.$store.state.username, alerts: {}};
  },
  methods: {
    async submit() {
      var url = `/api/events?coordinator=${this.value}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateEvents', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
