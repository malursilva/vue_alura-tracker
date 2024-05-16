<template>
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa"
            @aoSelecionarTarefa="selecionarTarefa" />
        <Box v-if="listaEstaVazia">
            Você não está muito produtivo hoje :/
        </Box>
        <div class="modal" :class="{ 'is-active': tarefaSelecionada }" v-if="tarefaSelecionada">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Editando uma Tarefa</p>
                    <button class="delete" aria-label="close" @click="fecharModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label for="descricaoTarefa" class="label">
                            Descrição
                        </label>
                        <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoTarefa">
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <div class="buttons">
                        <button class="button is-success" @click="alterarTarefa">Salvar Alterações</button>
                        <button class="button" @click="fecharModal">Cancelar</button>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Formulario from '../components/Formulario.vue'
import Tarefa from '../components/Tarefa.vue'
import Box from '../components/Box.vue'
import { useStore } from '@/store';
import { ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_PROJETOS, OBTER_TAREFAS } from '@/store/tipo-acoes';
import ITarefa from '@/interfaces/ITarefa';

export default defineComponent({
    name: 'TarefasView',
    components: {
        Formulario,
        Tarefa,
        Box
    },
    computed: {
        listaEstaVazia(): boolean {
            return this.tarefas.length == 0
        }
    },
    setup() {
        const store = useStore()
        const tarefas = computed(() => store.state.tarefa.tarefas)
        const tarefaSelecionada = ref(null as ITarefa | null)

        const fecharModal = () => {
            tarefaSelecionada.value = null
        }
        const salvarTarefa = (tarefa: ITarefa) => {
            store.dispatch(CADASTRAR_TAREFA, tarefa)
        }
        const alterarTarefa = () => {
            store.dispatch(ALTERAR_TAREFA, tarefaSelecionada.value).then(() => fecharModal())
        }
        const selecionarTarefa = (tarefa: ITarefa) => {
            tarefaSelecionada.value = tarefa
        }
        
        store.dispatch(OBTER_TAREFAS)
        store.dispatch(OBTER_PROJETOS)
        
        return {
            store,
            tarefas,
            tarefaSelecionada,
            salvarTarefa,
            alterarTarefa,
            selecionarTarefa,
            fecharModal
        }
    }
});
</script>