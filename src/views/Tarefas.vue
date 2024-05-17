<template>
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
        <div class="field">
            <p class="control has-icons-left">
                <input type="text" class="input" placeholder="Digite a descrição para filtrar" v-model="filtro" />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa"
            @aoSelecionarTarefa="selecionarTarefa" />
        <Box v-if="listaEstaVazia">
            Não foram encontradas tarefas :/
        </Box>
        <Modal :mostrar="tarefaSelecionada != null">
            <template v-slot:cabecalho>
                <p class="modal-card-title">Editando uma Tarefa</p>
                <button class="delete" aria-label="close" @click="fecharModal"></button>
            </template>
            <template v-slot:corpo>
                <div class="field">
                    <label for="descricaoTarefa" class="label">
                        Descrição
                    </label>
                    <input type="text" class="input" v-model="tarefaSelecionada!.descricao" id="descricaoTarefa">
                </div>
            </template>
            <template v-slot:rodape>
                <div class="buttons">
                    <button class="button is-success" @click="alterarTarefa">Salvar Alterações</button>
                    <button class="button" @click="fecharModal">Cancelar</button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import Formulario from '../components/Formulario.vue'
import Tarefa from '../components/Tarefa.vue'
import Box from '../components/Box.vue'
import Modal from '../components/Modal.vue'
import { useStore } from '@/store';
import { ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_PROJETOS, OBTER_TAREFAS } from '@/store/tipo-acoes';
import ITarefa from '@/interfaces/ITarefa';

export default defineComponent({
    name: 'TarefasView',
    components: {
        Formulario,
        Tarefa,
        Box,
        Modal
    },
    computed: {
        listaEstaVazia(): boolean {
            return this.tarefas.length == 0
        }
    },
    setup() {
        const store = useStore()
        const filtro = ref("")
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

        watchEffect(() => {
            store.dispatch(OBTER_TAREFAS, filtro.value)
        })

        return {
            store,
            tarefas,
            tarefaSelecionada,
            filtro,
            salvarTarefa,
            alterarTarefa,
            selecionarTarefa,
            fecharModal
        }
    }
});
</script>